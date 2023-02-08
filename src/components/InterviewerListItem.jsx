import React from "react";
import classNames from "classnames";
import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  

  const listClasses = classNames("interviewers_item", {
  'interviewers_item--selected': props.selected});

  return (
    <li 
      className={listClasses}
      onClick={props.setInterviewer}
      >
        <img
          className="interviewers_item-image"
          src={props.avatar}
          alt={props.name}
          />
          {props.selected && props.name}
      </li>
  );
};