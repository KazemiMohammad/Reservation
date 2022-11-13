import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../../styles/Home.module.css";
import AddReservation from "../AddReservation";
import ReservationList from "../ReservationList";

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleSelectDate = (value: Date) => {
    console.log('selected Date:',value);
    
    setSelectedDate(value);
  };
  return (
    <main className={styles.main}>
      <div>
        <h1 className={styles.title}>Select your date</h1>
        <Calendar onChange={handleSelectDate} />
      </div>

      <AddReservation/>
      <ReservationList reservationDate={selectedDate} />
    </main>
  );
};

export default Reservation;
