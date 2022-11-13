import create, { createStore, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export interface Reservation {
  user: string;
  startDate: string;
  endDate: string;
}

export type ReservationSlice = {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
};
type MyPersist = (
  config: StateCreator<ReservationSlice>,
  options: PersistOptions<ReservationSlice>
) => StateCreator<ReservationSlice>;

export const useReservation = create<ReservationSlice>(
  (persist as MyPersist)(
    (set) => ({
      reservations: [],
      addReservation: (newReserve: Reservation) => {
        set((state: ReservationSlice) => {
          return { reservations: [...state.reservations, newReserve] };
        });
      },
    }),

    { name: "reservation" }
  )
);
