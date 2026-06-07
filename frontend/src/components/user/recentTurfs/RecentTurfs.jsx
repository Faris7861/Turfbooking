import useFetch from "../../../hooks/useFetch";
import "./recentTurfs.css";

const RecentTurfs = () => {
  const { data, loading, error } = useFetch("/api/turfs/");
  const turfs = data || [];

  if (loading) return <p>Loading turfs...</p>;
  if (error) return <p>Error loading turfs: {error.message}</p>;

  return (
    <section className="turfs-section">
      <h2 className="turfs-title">Most Used Turfs</h2>
      <div className="turfs-wrapper">
        {turfs.map((turf) => (
          <div key={turf.id} className="turf-card">
            {/* If you have multiple images, pick the first one */}
            <img
              src={turf.images && turf.images.length > 0 ? turf.images[0] : "/placeholder.jpg"}
              alt={turf.name}
              className="turf-image"
            />
            <div className="turf-info">
              <h3 className="turf-name">{turf.name}</h3>
              <p className="turf-location">{turf.city}</p>
              <span className="turf-rating">⭐ {turf.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentTurfs;
