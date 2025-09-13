import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { useState } from "react";

export default function MainLayout() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  return (
    <div className="lg:flex lg:justify-between">
      <Sidebar
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
      />
      <main className={`w-full lg:transition-all lg:duration-700 ${
          sidebarMinimized ? "lg:ml-[88px]" : "lg:ml-[300px]"
        }`}>
        <Outlet context={{ sidebarMinimized }} />
      </main>
    </div>
  );
}
