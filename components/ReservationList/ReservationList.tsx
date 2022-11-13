import React, { useMemo } from "react";
import { useReservation, Reservation } from "../../lib/useReservation";
import { format, isSameDay } from "date-fns";
interface ReservationListProps {
  reservationDate: Date;
}

const ReservationList = ({ reservationDate }: ReservationListProps) => {
  const { reservations } = useReservation();

  const filteredReservations = useMemo(
    () =>
      reservations.filter((reserve: Reservation) =>
        [
          format(reserve.startDate, "yyyyMMdd"),
          format(reserve.endDate, "yyyMMdd"),
        ].includes(format(reservationDate, "yyyMMdd"))
      ),
    [reservations, reservationDate]
  );
  
  const generateReservationString = (reserve: Reservation): string => {
    return `${reserve.user} - ${formatDateToDisplay(
      reserve.startDate
    )} → ${formatDateToDisplay(reserve.endDate)}`;
  };

  const formatDateToDisplay = (value: Date) => {
    let formatString: string = isSameDay(value, reservationDate)
      ? "hh a"
      : "EEEE hh a";
    return format(value, formatString);  
  };  

  function generateListItems(): React.ReactNode {
    return filteredReservations.map((reserve: Reservation, index: number) => (
      <div
        key={reserve.user + index}
        className="flex rounded m-1 p-2 cursor-pointer bg-violet-200 hover:bg-violet-300 border border-violet-400"
      >
        {generateReservationString(reserve)}
      </div>
    ));
  }

  return <div className="flex flex-col">{generateListItems()}</div>;
};

export default ReservationList;
