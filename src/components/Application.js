import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

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
    });
  });
};

const setDay = day => setState({ ...state, day });
const dailyAppointments = getAppointmentsForDay(state, state.day);
const interviewers = getInterviewersForDay(state, state.day);
  
const appointmentList = dailyAppointments.map((appointment) => {    
  const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
        key={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });


  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
