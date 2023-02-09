import { useState, useEffect } from "react";
import axios from "axios";

export const useApplicationData = () => {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

// GET Routes
useEffect(() => {
  Promise.all([
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers')
    ]).then((responses) => {
      setState(prev => 
      ({...prev, days: responses[0].data,
          appointments: responses[1].data, 
          interviewers: responses[2].data}));
    });
  }, []);

const getUpdateSpots = (appointments) => {
  const day = state.days.find(day => day.name === state.day);
  const spots = day.appointments.filter(id => !appointments[id].interview).length;
  
  return state.days.map(day => state.day === day.name ? {...day, spots } : {...day});

}; 

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
  }).then(res => {
    setState({
      ...state,
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
  .then(res => {
    setState({
      ...state,
      appointments,
      days: getUpdateSpots(appointments)
    });
  });
};
return { state, setDay, bookInterview, cancelInterview };
};
