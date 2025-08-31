import { Outlet } from "react-router";

export const AdminLayout = () => {
    return (
        <div className="bg-blue-400">
            <Outlet />
        </div>
    );
};
