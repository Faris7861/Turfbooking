import { useState } from "react";
import "./turfSlots.css";

const TurfSlots = ({ slots }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="slots-box">
      <h3 className="slots-title">Available Slots</h3>
      <div className="slots-grid">
        {slots.map((slot, index) => {
          const isBooked = slot.status === "booked";
          const isSelected = selected === index;

          return (
            <div
              key={index}
              className={
                "slot-item " +
                (isBooked ? "slot-booked" : isSelected ? "slot-selected" : "slot-available")
              }
              onClick={() => !isBooked && setSelected(index)}
            >
              {slot.time}
            </div>
          );
        })}
      </div>

      <button
        className="book-btn"
        disabled={selected === null}
      >
        Book Now
      </button>
    </div>
  );
};

export default TurfSlots;
