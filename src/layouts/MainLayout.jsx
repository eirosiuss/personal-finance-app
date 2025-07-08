import { Outlet } from "react-router-dom";
import Sidebar from "../shared/sidebar/Sidebar";

const MainLayout = () => {
    return (
        <>
            <div className="container">
                <Sidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default MainLayout;