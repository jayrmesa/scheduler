export const getAppointmentsForDay = (state, day) => {

  const appointmentDay = state.days.find(d => d.name === day);
  
   // Return an empty array if the days data did not find it equal
  if (!appointmentDay) {
  return [];
  }
  
  // Filter the data for the filtered appointments only
  const filteredAppointments = Object.values(state.appointments).filter
  
  // includes the array of appointment IDs from the day object
  (appointment => appointmentDay.appointments.includes(appointment.id));

  return filteredAppointments;
};

export const getInterview = (state, interview) => {
  
   // If there is no interview, return null
  if (!interview) {
    return null;
  }

  // If there is an interview, return object, otherwise null
  const interviewer = state.interviewers[interview.interviewer];
  if (!interviewer) {
    return null;
  }

  return { ...interview, interviewer};
};

export const getInterviewersForDay = (state, day) => {
  
  //Return an empty array if the days data is empty
  const daysData = state.days.find(d => d.name === day);
  if (!daysData) {
    return [];
  }

  // Filter the interviewers data for the day 
  const filteredInterviewers = Object.values(state.interviewers).filter(interviewer => 
    daysData.interviewers.includes(interviewer.id)
  );
  return filteredInterviewers;
};