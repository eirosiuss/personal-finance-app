// import { useState, useEffect } from "react";

// export default function useData() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     async function getData() {
//       try {
//         const response = await fetch("http://localhost:6060/");
//         if (!response.ok) {
//           throw new Error(`HTTP error: ${response.statusText}`);
//         }
//         const data = await response.json();
//         setData(data[0]);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       }
//     }
//     getData();
//   }, []);

//   return { data };
// }
