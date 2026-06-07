import { useState } from "react";
import axios from "axios";

const usePost = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (body = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // only if you use cookies/sessions
      });
      setData(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      setLoading(false);
      return null;
    }
  };

  return { data, loading, error, execute };
};

export default usePost;
