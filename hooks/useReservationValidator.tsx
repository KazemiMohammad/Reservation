import { compareAsc, format, getOverlappingDaysInIntervals } from "date-fns";
import React from "react";
import { Reservation } from "../lib/useReservation";

const useReservationValidator = (reservations: Reservation[]) => {
  const isUserUniqueInDay = (user: string, selectedDate: Date) => {
    return (
      reservations.find(
        (reserve) =>
          format(new Date(reserve.startDate), "yyyyMMdd") ===
            format(selectedDate, "yyyMMdd") && reserve.user === user
      ) === undefined
    );
  };

  const isEndHourValid = (
    endNextDay: boolean,
    endHour: number,
    startHour: number
  ) => endNextDay || endHour - startHour >= 1;

  const isEndHourInValidOnNextDay = (endHour: number) => endHour <= 11;

  const hasSelectedRangeOverlap = (startDate: Date, endDate: Date): boolean => {
    const endNextDay:boolean=format(startDate, "yyyyMMdd")!==format(endDate, "yyyMMdd");

    const filteredReservations = reservations.filter((reserve: Reservation) =>
      [
        format(new Date(reserve.startDate), "yyyyMMdd"),
        format(new Date(reserve.endDate), "yyyMMdd"),
      ].includes(format(startDate, "yyyMMdd"))||[
        format(new Date(reserve.startDate), "yyyyMMdd"),
        format(new Date(reserve.endDate), "yyyMMdd"),
      ].includes(format(endDate, "yyyMMdd"))
    );
    const sortedReservations = filteredReservations.sort(
      (a: Reservation, b: Reservation) => compareAsc(a.startDate, b.startDate)
    );
    const startHour: number = startDate.getHours();
    const endHour: number = endDate.getHours();

    let overlap = sortedReservations.find((reserve) => {
      const reserveStartDate: Date = reserve.startDate;
      const reserveEndDate: Date = reserve.endDate;

      return (
        reserveStartDate === startDate ||
        reserveEndDate === endDate ||
        (reserveStartDate < startDate && reserveEndDate > startDate) ||
        (endNextDay&& reserveStartDate < endDate && reserveEndDate > endDate)||
        (startDate < reserveStartDate &&  endDate>reserveStartDate) ||
        (startDate < reserveEndDate &&  endDate>reserveEndDate) 
        
      );
    });
console.log(overlap);

    return overlap != undefined;
  };

  return {
    isUserUniqueInDay,
    isEndHourValid,
    isEndHourInValidOnNextDay,
    hasSelectedRangeOverlap,
  };
};

export default useReservationValidator;
