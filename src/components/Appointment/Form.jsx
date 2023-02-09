import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError ] = useState("");

  // Clear interviewer and student
  const reset = function() {
    setStudent("");
    setInterviewer(null);
    
  }

  // reset state and call onCancel
  const cancel = function() {
    reset();
    props.onCancel();
  };

  const formError = () => {
    if (student === "") {
      return setError("Your name cant be blank");
    }

    if (interviewer === null) {
      return setError("Select an interviewer please");
    }

    setError("");
    props.onSave(student, interviewer); 
  }



  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">

        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
          />
        </form>

        <section className="appointment__validation">{error}</section>
        <InterviewerList 
          interviewers={props.interviewers} //props.interviewers TODO
          interviewer={interviewer}
          onChange={setInterviewer}
        />
      </section>
      
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={formError}>Save</Button>
        </section>
      </section>
    </main>
  );

}