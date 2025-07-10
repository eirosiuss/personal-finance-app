import data from "../data.json";

const Overview = () => {
  const balance = data.balance;
  const pots = data.pots;

  return (
    <>
      <div className="financial-summary">
        <h1>Overview</h1>
        {Object.entries(balance).map(([key, value]) => (
          <article key={key}>
            <h3>
              {key === "current"
                ? `${key.charAt(0).toUpperCase() + key.slice(1)} Balance`
                : `${key.charAt(0).toUpperCase() + key.slice(1)}`}
            </h3>
            <p>${value}</p>
          </article>
        ))}
      </div>
      <div className="pots">
        <h2>Pots</h2>
        <div>
          <h3>Total Saved</h3>
          {<p>${pots.reduce((acc, pot) => acc + pot.total, 0)}</p>}
        </div>
        {pots.slice(0, 4).map((pot, index) => (
          <article key={index}>
            <h3>{pot.name}</h3>
            <p>${pot.total}</p>
          </article>
        ))}
      </div>
    </>
  );
};

export default Overview;
