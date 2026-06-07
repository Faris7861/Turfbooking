import { useState, useEffect } from "react";
import "./slotModal.css";
import useFetch from "../../../hooks/useFetch";
import usePost from "../../../hooks/usePost";

const SlotModal = ({ turfId, userId, onClose }) => {
  const days = getNext7Days();
  const [selectedDay, setSelectedDay] = useState(days[0].date);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const {
    data: slots,
    loading,
    error,
    reFetch,
  } = useFetch(`/api/turfs/${turfId}/availability?date=${selectedDay}`);


  const {
    execute: postBooking,
    loading: bookingLoading,
    error: bookingError,
  } = usePost("/api/turfs/bookings");

  useEffect(() => {
    reFetch();
    setSelectedSlot(null);
  }, [selectedDay]);

  const currentHour = new Date().getHours();
  const todayStr = new Date().toISOString().split("T")[0];

  const handleBook = async () => {
    if (!selectedSlot) return;

    const payload = {
      turf_id: Number(turfId),
      user_id: Number(userId),
      booking_date: selectedDay, 
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
    };

    const res = await postBooking(payload);
    if (!res) return;

    await reFetch();
    setSelectedSlot(null);
  };


  return (
    <div className="slot-backdrop">
      <div className="slot-modal">
        <div className="slot-header">
          <h3>Choose Your Slot</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="day-row">
          {days.map((d, i) => (
            <div
              key={i}
              className={`day-item ${selectedDay === d.date ? "active" : ""}`}
              onClick={() => setSelectedDay(d.date)}
            >
              <div className="day-name">{d.day}</div>
              <div className="day-date">{d.dateNum}</div>
            </div>
          ))}
        </div>

        <div className="time-grid">
          {loading && <p>Loading slots...</p>}
          {error && <p>Error loading slots</p>}

          {!loading &&
            slots &&
            slots.map((slot, i) => {
              const isToday = selectedDay === todayStr;
              const slotHour = parseInt(slot.start_time.split(":")[0], 10);
              const endHour = slotHour + 1;
              const isPast = isToday && endHour <= currentHour;

              const blocked = !slot.available || isPast;
              const selected = selectedSlot?.start_time === slot.start_time;

              return (
                <div
                  key={i}
                  className={`time-item ${selected ? "selected" : ""} ${blocked ? "blocked" : ""}`}
                  onClick={() => !blocked && setSelectedSlot(slot)}
                >
                  {slot.start_time} - {slot.end_time}
                </div>
              );
            })}
        </div>

        <div className="slot-footer">
          <button
            className="confirm-btn"
            disabled={!selectedSlot || bookingLoading}
            onClick={handleBook}
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>

        {bookingError && <p className="booking-error">Booking failed</p>}
      </div>
    </div>
  );
};

function getNext7Days() {
  const res = [];
  const options = { weekday: "long" };
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    res.push({
      day: d.toLocaleDateString("en-US", options),
      dateNum: d.getDate(),
      date: d.toISOString().split("T")[0], // critical fix (backend format)
    });
  }
  return res;
}

export default SlotModal;
