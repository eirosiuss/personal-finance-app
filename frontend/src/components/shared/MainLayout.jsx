import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";

export default function MainLayout() {
  return (
    <>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
