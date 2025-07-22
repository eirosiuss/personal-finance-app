import { useState, useEffect } from "react";

export default function useData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch("http://localhost:5050/");
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const data = await response.json();
      setData(data[0]);
    }

    getData();
  }, []);

  return { data };
}
