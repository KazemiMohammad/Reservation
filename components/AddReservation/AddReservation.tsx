import React from "react";
import { Reservation, useReservation } from "../../lib/useReservation";

const AddReservation = () => {
  const { addReservation } = useReservation();
  
  const handleAddReservation = () => {
    let newReservation:Reservation={
        user:'name '+Math.random(),
        startDate:new Date().toISOString(),
        endDate:new Date().toISOString(),
    }
    console.log('new reservation param: ',newReservation);
    
    addReservation(newReservation);
  };

  return (
    <div className="flex flex-col">
      <div>
        <button onClick={handleAddReservation}>Add</button>
      </div>
    </div>
  );
};

export default AddReservation;
