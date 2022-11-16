import React, { useMemo } from "react";
import { useReservation, Reservation } from "../../lib/useReservation";
import { format, isSameDay } from "date-fns";
import ReservationItem from "../ReservationItem/ReservationItem";
import styles from './ReservationList.module.css';
interface ReservationListProps {
  reservationDate: Date;
}

const ReservationList = ({ reservationDate }: ReservationListProps) => {
  const { reservations } = useReservation();

  const filteredReservations = useMemo(
    () =>
      reservations.filter((reserve: Reservation) =>
        [
          format(new Date(reserve.startDate), "yyyyMMdd"),
          format(new Date(reserve.endDate), "yyyMMdd"),
        ].includes(format(new Date(reservationDate), "yyyMMdd"))
      ),
    [reservations, reservationDate]
  );

  function generateListItems(): React.ReactNode {
    return filteredReservations.map((reserve: Reservation, index: number) => (
      <ReservationItem key={reserve.user} Reserve={reserve} SelectedDate={reservationDate} />
    ));
  }

  return <div className={styles.ReservationList}>{generateListItems()}</div>;
};

export default ReservationList;
