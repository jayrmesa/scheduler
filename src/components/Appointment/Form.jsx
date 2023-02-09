import React, { useState } from "react";
import InterviewerList from "../InterviewerList";
import Button from "../Button";

export default function Form(props) {

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

    // Clear interviewer and student
    const reset = function() {
      setInterviewer(null);
      setStudent("");
    }
  
    // reset state and call onCancel
    const cancel = function() {
      reset();
      props.onCancel();
    };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">

        <form autoComplete="off" onSubmit={event => event.preventDefault}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
          />
        </form>

        <InterviewerList 
          interviewers={props.interviewers} //props.interviewers TODO
          interviewer={interviewer}
          onChange={setInterviewer}
        />
      </section>
      
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => props.onSave(student, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );

}