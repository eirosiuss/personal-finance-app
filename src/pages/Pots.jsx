import data from "../data.json";

const Pots = () => {
  const pots = data.pots;

  return (
    <>
      {pots.map((pot, index) => (
        <article key={index}>
          <h3>{pot.name}</h3>
          <p>
            Total Saved<span>${pot.total}.00</span>
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(pot.total / pot.target) * 100}%`,
                backgroundColor: pot.theme,
              }}
            ></div>
          </div>
          <div className="progress-bar-text">
            <p>{((pot.total / pot.target) * 100).toFixed(2)}%</p>
            <p>Target of ${pot.target}</p>
          </div>
          <div>
            <button>+ Add Money</button>
            <button>Withdraw</button>
          </div>
        </article>
      ))}
    </>
  );
};

export default Pots;
