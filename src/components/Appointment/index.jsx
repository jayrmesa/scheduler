import React from "react";
import "components/Appointment/styles.scss";
import { useVisualMode } from "hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";


export default function Appointment(props) {

  const interview = {...props.interview};
  const interviewerObj = {...interview.interviewer};



  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";


  // Visual mode logic , if interview prop exists mode is SHOW, else EMPTY
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);


 // Create appointment
 function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };
  
  transition(SAVING);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
  };


  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interviewerObj}
        />
       )}
       {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          student={interview.student}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && (
              <Status
                message={"Saving..."}
              />
            )}
    </article>
  );
};