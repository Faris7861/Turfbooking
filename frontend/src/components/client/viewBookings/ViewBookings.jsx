import { useEffect, useState } from "react";
import "./viewBookings.css";
import useFetch from "../../../hooks/useFetch";
import OfflineBooking from "../offlineBooking/OfflineBooking";

const ViewBookings = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const clientId = storedUser?.id;

  const [turfId, setTurfId] = useState(null);
  const [bookings, setBookings] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);



  const {
    data: turfData,
    loading: turfLoading,
    error: turfError,
  } = useFetch(clientId ? `/api/turfs/client/${clientId}` : null);



  const today = new Date().toISOString().split("T")[0];
  const {
    data: bookingData,
    loading: bookingLoading,
    error: bookingError,
  } = useFetch(turfId ? `/api/turfs/bookings/${turfId}?date=${today}` : null);

  useEffect(() => {
    if (Array.isArray(turfData) && turfData.length > 0) {
      setTurfId(turfData[0].id);
    }
  }, [turfData]);



  useEffect(() => {
    if (bookingData) {
      setBookings(
        Array.isArray(bookingData) ? bookingData : bookingData.bookings || [],
      );
    }
  }, [bookingData]);



  if (turfLoading || bookingLoading) {
    return <p>Loading ...</p>;
  }

  if (turfError || bookingError) {
    return <p className="error">Failed to load data</p>;
  }
  
  const n = 0;
  return (

    
    <div className="view-bookings">
      {modalOpen && (
          <OfflineBooking turfId={turfId} clientId={clientId} onClose={() => setModalOpen(false)} />
        )}

        <div className="turfWrapper">
          <button className="checkNow" onClick={() => setModalOpen(true)}>
            Check Availability!
          </button>
    </div>
      <h2>Bookings (Next 24 Hours)</h2>

      {bookings.length === 0 ? (
        <p>No bookings in the next 24 hours.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-row">
              <div className="booking-time">
                {booking.start_time} – {booking.end_time}
              </div>

              <div className="booking-user">{booking.username || "Offline Booking"}</div>

              <div className={`booking-status ${booking.status}`}>
                {booking.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
