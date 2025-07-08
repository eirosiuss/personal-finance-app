import { useEffect, useState } from 'react';

const Overview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('./data.json');
        const data = await response.json();
        console.log(data.balance.current);
    };
    fetchData();
  }, []);



  return (
    <div className="financial-summary">
      <article>
        <h3></h3>
        <p></p>
      </article>
      <article>
        <h3></h3>
        <p></p>
      </article>
      <article>
        <h3></h3>
        <p></p>
      </article>
    </div>
  )
}

export default Overview;
