import { Routes, Route } from "react-router-dom";
import LoginSection from "./pages/login/LoginSection";
import WebAdmin from "./pages/web-admin/WebAdmin";
import WebGuest from "./pages/web-guest/WebGuest";
import RequireAuth from "./components/RequireAuth";

const App = () => {
	return (
		<Routes>
			<Route path="/">
				{/* Public routes */}
				<Route path="login" element={<LoginSection />} />

				{/* Protected routes */}
				<Route element={<RequireAuth />}>
					<Route path="/admin" element={<WebGuest />} />
					<Route path="/guest" element={<WebGuest />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default App;
