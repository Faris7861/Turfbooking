import "./turfInfo.css";

const TurfInfo = ({ turf }) => {
  return (
    <div className="turf-info-box">
      <h2 className="turf-name">{turf.name}</h2>
      <p className="turf-location">{turf.location}</p>
      <p className="turf-rating">⭐ {turf.rating}</p>
      <p className="turf-description">{turf.description}</p>
    </div>
  );
};

export default TurfInfo;
