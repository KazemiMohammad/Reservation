import { daysInWeek } from "date-fns";
import { format } from "date-fns";
import React, { useState } from "react";
import Calendar, { CalendarTileProperties } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Reservation, useReservation } from "../../lib/useReservation";
import AddReservation from "../AddReservation";
import ReservationList from "../ReservationList";
import styles from "./Reservation.module.css";
const Reservation = () => {
  const { reservations } = useReservation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isWorkday, setIsWorkday] = useState<boolean>();

  const handleSelectDate = (value: Date) => {
    setIsWorkday(checkIsWorkday(value));
    setSelectedDate(value);
  };

  const checkIsWorkday = (value: Date) => ![6, 0].includes(value.getDay());

  const getReserveLength = (reserve: Reservation) => {
    if (
      new Date(reserve.endDate).getDay() !==
      new Date(reserve.startDate).getDay()
    )
      return (
        17 -
        new Date(reserve.startDate).getHours() +
        new Date(reserve.endDate).getHours() -
        9
      );

    return (
      new Date(reserve.endDate).getHours() -
      new Date(reserve.startDate).getHours()
    );
  };

  const getTileContent = (props: CalendarTileProperties) => {
    let reserves = reservations.filter((reserve) =>
      [
        format(new Date(reserve.startDate), "yyyyMMdd"),
        format(new Date(reserve.endDate), "yyyMMdd"),
      ].includes(format(new Date(props.date), "yyyMMdd"))
    );
    let hours = reserves.reduce(
      (total, curr) => total + getReserveLength(curr),
      0
    );

    let usedPercentage = Math.floor(hours * 1.25) * 10;

    return (
      <>
        <div
          className={styles.TileUsage + `bg-green-${usedPercentage}0 `}
        ></div>
        <div className={styles.TileTooltip}>Reserved hours: {hours}</div>
      </>
    );
  };

  return (
    <>
      <div>
        <h1 className={styles.Title}>Select your date to reserve</h1>
        <Calendar
          onChange={handleSelectDate}
          minDate={new Date()}
          tileContent={getTileContent}
          tileClassName="group"
        />
      </div>
      {isWorkday && <AddReservation selectedDate={selectedDate} />}
      {!isWorkday && (
        <div className={styles.Title}>Selected day is not a work day!</div>
      )}
      <ReservationList reservationDate={selectedDate} />
    </>
  );
};

export default Reservation;
