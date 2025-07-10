import data from "../data.json";

const Pots = () => {
  const pots = data.pots;

  return (
    <>
      {pots.map((pot, index) => (
        <article key={index}>
          <h3>{pot.name}</h3>
          <p>Total Saved<span>${pot.total}.00</span></p>
          <p>Target of ${pot.target}</p>
        </article>
      ))}
    </>
  );
};

export default Pots;
