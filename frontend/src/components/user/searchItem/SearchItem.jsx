import { Link } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  return (
    <div className="searchItem">
      <img
        src={item.images?.[0] || "/placeholder.jpg"}
        alt={item.name}
        className="siImg"
      />

      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siSubtitle">{item.description}</span>
      </div>

      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>
        )}

        <div className="siDetailTexts">
          <Link to={`/turfs/${item.id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
