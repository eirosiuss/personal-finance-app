import { Outlet } from "react-router-dom";
import Sidebar from "./components/shared/Sidebar";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
