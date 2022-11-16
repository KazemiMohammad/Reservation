import React from "react";
import { Reservation, useReservation } from "../../lib/useReservation";
import { useForm } from "react-hook-form";
import useReservationValidator from "../../hooks/useReservationValidator";
import styles from "./AddReservation.module.css";

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
    <div className={styles.Container}>
      <form onSubmit={onSubmit}>
        <div className={styles.InputContainer}>
          <div className={styles.Input}>
            <label htmlFor="user">Name</label>
            <input {...register("user", { required: true })} />
          </div>
          <div className={styles.Input}>
            <label htmlFor="user">From</label>
            <select {...register("startHour")}>
              {getAvailableTimeOptions(selectedDate)}
            </select>
          </div>
          <div className={styles.Input}>
            <label htmlFor="user">To</label>
            <select {...register("endHour")}>
              {getAvailableTimeOptions(selectedDate)}
            </select>
          </div>
          <div className={styles.InputCheckBox}>
            <input
              {...register("endNextDay")}
              id="endNextDay"
              type="checkbox"
            />
            <label htmlFor="endNextDay"> Until next day</label>
          </div>
          <div className={styles.ButtonContainer}>
            <button type="submit">Add</button>
          </div>
        </div>
        {errors.user && (
          <span className={styles.Error}>{errors.user.message}</span>
        )}
        {errors.startHour && (
          <span className={styles.Error}>{errors.startHour.message}</span>
        )}
        {errors.endHour && (
          <span className={styles.Error}>{errors.endHour.message}</span>
        )}
      </form>
    </div>
  );
};

export default AddReservation;
