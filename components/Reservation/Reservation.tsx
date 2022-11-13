import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddReservation from "../AddReservation";
import ReservationList from "../ReservationList";

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleSelectDate = (value: Date) => {
    setSelectedDate(value);
  };

  return (
    <>
      <div>
        <h1 className="text-lg font-bold text-violet-600">Select your date to reserve</h1>
        <Calendar onChange={handleSelectDate} minDate={new Date()} />
      </div>
      <AddReservation />
      <ReservationList reservationDate={selectedDate} />
    </>
  );
};

export default Reservation;
