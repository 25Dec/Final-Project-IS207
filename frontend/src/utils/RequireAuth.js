import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import StoreContext from "../context/StoreContextProvider";

const RequireAuth = ({ allowedRoles }) => {
	const { auth } = useContext(StoreContext);
	const location = useLocation();

	return allowedRoles.includes(auth.userRight) ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};

export default RequireAuth;
