import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import SearchField from "../../../components/user/searchField/SearchField";
import SearchItem from "../../../components/user/searchItem/SearchItem";

const Search = () => {
  const [query, setQuery] = useState("");

  const { data, loading, error, reFetch } = useFetch(
    query ? `/api/turfs?search=${query}` : "/api/turfs"
  );


  const turfs = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const handleClick = () => {
    reFetch();
  };

  return (
    <div className="search-page">
      <SearchField query={query} setQuery={setQuery} />
      <button onClick={handleClick}>Search</button>

      {loading && <p>Searching turfs...</p>}
      {error && <p>Error loading turfs</p>}

      {!loading &&
        turfs.map((item) => (
          <SearchItem item={item} key={item.id} />
        ))}
    </div>
  );
};

export default Search;
