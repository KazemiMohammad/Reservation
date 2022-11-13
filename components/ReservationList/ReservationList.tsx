import React from "react";
import { useReservation, Reservation } from "../../lib/useReservation";

interface ReservationListProps {
  reservationDate: Date;
}

const ReservationList = ({ reservationDate }: ReservationListProps) => {
  const { reservations } = useReservation();
  return (
    <div className="flex flex-col">
      {reservations.map((reserve: Reservation, index: number) => {
        return (
          <div key={reserve.user + index} className="flex">
            <div>
              Name:<span>{reserve.user}</span>
            </div>
            <div>
              Start:<span>{reserve.startDate}</span>
            </div>
            <div>
              End:<span>{reserve.endDate}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReservationList;
