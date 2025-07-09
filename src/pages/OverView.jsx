import { useEffect, useState } from "react";

const Overview = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="financial-summary">
      {data.balance &&
        Object.entries(data.balance).map(([key, value]) => (
          <article key={key}>
            <h3>{key === "current" ? `${key.charAt(0).toUpperCase() + key.slice(1)} Balance` : `${key.charAt(0).toUpperCase() + key.slice(1)}`}</h3>
            <p>${value}</p>
          </article>
        ))}
    </div>
  );
};

export default Overview;
