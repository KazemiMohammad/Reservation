import React from "react";
import { Reservation, useReservation } from "../../lib/useReservation";
import { useForm } from "react-hook-form";
import {
  getOverlappingDaysInIntervals,
  areIntervalsOverlapping,
  format,
  compareAsc,
} from "date-fns";
import useReservationValidator from "../../hooks/useReservationValidator";
type AddReservationFormFields = {
  user: string;
  startHour: number;
  endHour: number;
  endNextDay: boolean;
};

const AddReservation = ({ selectedDate }: { selectedDate: Date }) => {
  const { reservations, addReservation } = useReservation();
  const {
    isUserUniqueInDay,
    isEndHourValid,
    isEndHourInValidOnNextDay,
    hasSelectedRangeOverlap,
  } = useReservationValidator(reservations);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<AddReservationFormFields>();

  const getAvailableTimeOptions = (date: Date): React.ReactElement[] => {
    let availableTimes: number[] = [9, 10, 11, 12, 13, 14, 15, 16, 17];

    return availableTimes.map((time: number) => (
      <option key={time} value={time}>
        {time}
      </option>
    ));
  };
  const isFormDataValid = (formData: AddReservationFormFields): boolean => {
    const { user, startHour, endHour, endNextDay } = formData;

    if (!isUserUniqueInDay(user, selectedDate)) {
      setError("user", {
        type: "value",
        message: "Each user is allow to reserve once a day!",
      });
      return false;
    }

    if (!isEndHourValid(endNextDay, endHour, startHour)) {
      setError("endHour", {
        type: "pattern",
        message: "End time should be at least 1 hour after the Start time!",
      });
      return false;
    }

    if (endNextDay && !isEndHourInValidOnNextDay(endHour)) {
      setError("endHour", {
        type: "pattern",
        message: "You could just reserve the car until 11 AM of next day!",
      });
      return false;
    }

    let startDate: Date = new Date(selectedDate);
    startDate.setHours(formData.startHour);

    let endDate: Date = new Date(selectedDate);
    endDate.setHours(formData.endHour);
    formData.endNextDay && endDate.setDate(endDate.getDate() + 1);

    if (hasSelectedRangeOverlap(startDate, endDate)) {
      setError("endHour", {
        type: "pattern",
        message: "There is a overlap with your selected times!",
      });
      return false;
    }

    return true;
  };

  const onSubmit = handleSubmit((formData: AddReservationFormFields) => {
    if (!isFormDataValid(formData)) return;

    let startDate: Date = new Date(selectedDate);
    startDate.setHours(formData.startHour);

    let endDate: Date = new Date(selectedDate);
    endDate.setHours(formData.endHour);
    formData.endNextDay && endDate.setDate(endDate.getDate() + 1);

    let newReservation: Reservation = {
      user: formData.user,
      startDate,
      endDate,
    };

    addReservation(newReservation);
    reset();
  });

  return (
    <div className="rounded border border-violet-400 m-2 p-2 bg-white">
      <form onSubmit={onSubmit}>
        <div className="flex">
          <div className="flex flex-col mr-1">
            <label htmlFor="user" className="text-sm text-violet-600">
              Name
            </label>
            <input
              {...register("user", { required: true })}
              className="border border-violet-200 rounded p-1"
            />
          </div>
          <div className="flex flex-col mx-1">
            <label htmlFor="user" className="text-sm text-violet-600">
              From
            </label>
            <select {...register("startHour")} className="border rounded p-1">
              {getAvailableTimeOptions(selectedDate)}
            </select>
          </div>
          <div className="flex flex-col mx-1">
            <label htmlFor="user" className="text-sm text-violet-600">
              To
            </label>
            <select {...register("endHour")} className="border rounded p-1">
              {getAvailableTimeOptions(selectedDate)}
            </select>
          </div>
          <div className="m-1 p-1 flex items-end gap-1">
            <input
              {...register("endNextDay")}
              id="endNextDay"
              type="checkbox"
              className="h-5"
            />
            <label htmlFor="endNextDay"> Until next day</label>
          </div>
          <div className="ml-2 flex items-end">
            <button
              type="submit"
              className="m-1 p-1 w-20 rounded border bg-violet-100 border-violet-400 text-violet-900"
            >
              Add
            </button>
          </div>
        </div>
        {errors.user && (
          <span className="text-red-400 text-sm">{errors.user.message}</span>
        )}
        {errors.startHour && (
          <span className="text-red-400 text-sm">
            {errors.startHour.message}
          </span>
        )}
        {errors.endHour && (
          <span className="text-red-400 text-sm">{errors.endHour.message}</span>
        )}
      </form>
    </div>
  );
};

export default AddReservation;
