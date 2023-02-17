import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer (state, action) {
  switch (action.type) {

    case SET_DAY:
      return { ...state, day: action.day };

    case SET_APPLICATION_DATA:
      return { 
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
      
    case SET_INTERVIEW: 
      return {
        ...state,
        appointments: action.appointments,
        days: action.days
    };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  };
};

export const useApplicationData = () => {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}, 
    ws: null
  });

// GET Routes and start the Websocket connection then populate days , appointments and interviewers based on API call
useEffect(() => {
  state.ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  Promise.all([
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers')
  ]).then((all) => {
    dispatch({
      type: SET_APPLICATION_DATA,
      days: all[0].data,
      appointments: all[1].data, 
      interviewers: all[2].data
    });
    });
  }, []);
  
// Set the onmessage event listener to websocket
// If type is SET_INTERVIEW, update appointment interview in state 
useEffect(() => {

  state.ws.onopen = () => {
    state.ws.send('ping');
  };

  state.ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const { type, id, interview } = data;

    if (type === "SET_INTERVIEW") {
      const appointment = {
        ...state.appointments[id],
        interview: interview ? {...interview} : null
      };
      
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };

      dispatch({
        type: SET_INTERVIEW,
        appointments,
        days: getUpdateSpots(appointments, id)
      });
    }
  }
}, [state.appointments])

const setDay = day => dispatch({ type: SET_DAY, day });

// Update appointment state based on appointment id and interview
const bookInterview = (id, interview) => {
  const appointment = {
    ...state.appointments[id],
    interview: {...interview}
  };
  
  const appointments = {     
    ...state.appointments,
    [id]: appointment
  };

  return axios.put(`/api/appointments/${id}`, {
    interview: interview
  }).then(() => {
    dispatch({
      type: SET_INTERVIEW,
      appointments,
      days: getUpdateSpots(appointments)
    });
  });
};

// Set appointment interview to null in state, which based on appointment id
const cancelInterview = id => {
  const appointment = {
    ...state.appointments[id],
    interview: null
  };

  const appointments = {
    ...state.appointments,
    [id]: appointment
  };
  
  // Call server API to cancel interview in appointment
  return axios.delete(`/api/appointments/${id}`)
  .then(() => {
    dispatch({
      type: SET_INTERVIEW,
      appointments,
      days: getUpdateSpots(appointments)
    });
  });
};

  // Count number of spots available based on current day selected
const getUpdateSpots = (appointments) => {
  const day = state.days.find(day => day.name === state.day);
  const spots = day.appointments.filter(id => !appointments[id].interview).length;
  
  return state.days.map(day => state.day === day.name ? {...day, spots } : {...day});

}; 

return { state, setDay, bookInterview, cancelInterview };
};
