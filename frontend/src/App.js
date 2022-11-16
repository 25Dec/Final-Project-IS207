import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import WebAdmin from "./pages/web-admin/WebAdmin";
import WebGuest from "./pages/web-guest/WebGuest";
import NotFound from "./pages/notfound/NotFound";
import RequireAuth from "./utils/RequireAuth";

const ROLES = {
	SUPER_ADMIN: "SUPER_ADMIN",
	ADMIN: "ADMIN",
	END_USER: "END_USER",
	ANONYMOUS: "ANONYMOUS",
};

const App = () => {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="login" element={<Login />} />

			{/* Protected routes */}
			<Route element={<RequireAuth allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.END_USER, ROLES.ANONYMOUS]} />}>
				<Route path="/" element={<Home />} />
			</Route>
			<Route element={<RequireAuth allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />}>
				<Route path="admin" element={<WebAdmin />} />
			</Route>
			<Route element={<RequireAuth allowedRoles={[ROLES.END_USER, ROLES.ANONYMOUS]} />}>
				<Route path="guest" element={<WebGuest />} />
			</Route>

			{/* Catch all */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default App;
