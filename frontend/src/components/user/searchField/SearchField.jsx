import "./searchField.css";

const SearchField = ({ query, setQuery }) => {
  return (
    <div className="search-field">
      <input
        type="text"
        placeholder="Search turfs by name or location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchField;
