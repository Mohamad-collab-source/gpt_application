
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "./MyContext.jsx";

const ProtectedRoute = () => {
    const { user, authLoading } = useContext(ChatContext);

    if (authLoading) {
        return <div>Checking authentication...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
