import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";

export default function MainLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
