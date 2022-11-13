import React from "react";
import { Reservation, useReservation } from "../../lib/useReservation";
import { useForm } from "react-hook-form";
import { compareAsc } from "date-fns";
type AddReservationFormFields = {
  user: string;
  startHour: number;
  endHour: number;
  endNextDay: boolean;
};

const AddReservation = ({ selectedDate }: { selectedDate: Date }) => {
  const { addReservation } = useReservation();

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
  const validateTimes = (formData: AddReservationFormFields): boolean => {
    const { startHour, endHour, endNextDay } = formData;
    if (!endNextDay && endHour - startHour < 1) {
      setError("endHour", {
        type: "pattern",
        message: "End time should be at least 1 hour after the Start time!",
      });
      return false;
    }
    if (endNextDay && endHour>11) {
      setError("endHour", {
        type: "pattern",
        message: "You could just reserve the car until 11 AM of next day!",
      });
      return false;
    }
    
    return true;
  };

  const onSubmit = handleSubmit((formData: AddReservationFormFields) => {
    if (!validateTimes(formData)) {
      return;
    }

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
          <input
            {...register("user", { required: true })}
            className="border rounded m-1 p-1"
          />
          <select {...register("startHour")} className="border rounded m-1 p-1">
            {getAvailableTimeOptions(selectedDate)}
          </select>
          <select {...register("endHour")} className="border rounded m-1 p-1">
            {getAvailableTimeOptions(selectedDate)}
          </select>
          <div className="m-1 p-1">
            <input
              {...register("endNextDay")}
              id="endNextDay"
              type="checkbox"
            />
            <label htmlFor="endNextDay"> Until next day</label>
          </div>
          <div>
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
          <span className="text-red-400 text-sm">{errors.startHour.message}</span>
        )}
        {errors.endHour && (
          <span className="text-red-400 text-sm">{errors.endHour.message}</span>
        )}
      </form>
    </div>
  );
};

export default AddReservation;
