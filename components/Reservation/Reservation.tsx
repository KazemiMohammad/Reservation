import { daysInWeek } from "date-fns";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddReservation from "../AddReservation";
import ReservationList from "../ReservationList";

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isWorkday, setIsWorkday] = useState<boolean>();

  const handleSelectDate = (value: Date) => {
    setIsWorkday(checkIsWorkday(value));
    setSelectedDate(value);
  };

  const checkIsWorkday = (value: Date) => ![6, 0].includes(value.getDay());

  return (
    <>
      <div>
        <h1 className="text-lg font-bold text-violet-600">
          Select your date to reserve
        </h1>
        <Calendar onChange={handleSelectDate} minDate={new Date()} />
      </div>
      {isWorkday&&<AddReservation selectedDate={selectedDate} />}
      {!isWorkday&&<div className="text-violet-700 font-bold text-lg">Selected day is not a work day!</div>}
      <ReservationList reservationDate={selectedDate} />
    </>
  );
};

export default Reservation;
