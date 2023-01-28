import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {

  // Using.map for days array to create a DayListItem componenet per day in state

  const dayItems = props.days.map(day =>
    <DayListItem
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.value}
      setDay={() => props.onChange}
    />);

  return (
    <ul>
      {dayItems}
    </ul>
  );
};