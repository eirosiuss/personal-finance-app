import data from "../data.json";

const Overview = () => {
  return (
    <div className="financial-summary">
      {Object.entries(data.balance).map(([key, value]) => (
          <article key={key}>
            <h3>{key === "current" ? `${key.charAt(0).toUpperCase() + key.slice(1)} Balance` : `${key.charAt(0).toUpperCase() + key.slice(1)}`}</h3>
            <p>${value}</p>
          </article>
        ))}
    </div>
  );
};

export default Overview;
