import { format, isSameDay } from "date-fns";
import React from "react";
import { Reservation } from "../../lib/useReservation";
import styles from "./ReservationItem.module.css";

interface ReservationItemProps {
  Reserve: Reservation;
  SelectedDate: Date;
}

const ReservationItem = ({ Reserve, SelectedDate }: ReservationItemProps) => {
  const generateReservationString = (reserve: Reservation): string => {
    return `${reserve.user} - ${formatDateToDisplay(
      reserve.startDate
    )} → ${formatDateToDisplay(reserve.endDate)}`;
  };

  const formatDateToDisplay = (value: Date) => {
    let formatString: string = isSameDay(value, SelectedDate)
      ? "hh a"
      : "EEEE hh a";
    return format(new Date(value), formatString);
  };

  return (
    <div key={Reserve.user} className={styles.ReservationItem}>
      {generateReservationString(Reserve)}
    </div>
  );
};

export default ReservationItem;
