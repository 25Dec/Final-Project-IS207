import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import ListOfBooks from "./pages/ListOfBooks/ListOfBooks";
import DetailOfBook from "./pages/DetailOfBook/DetailOfBook";
import SearchBook from "./pages/SearchBook/SearchBook";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import Contact from "./pages/Contact/Contact";
import Stats from "./pages/Stats/Stats";
import NotFound from "./pages/NotFound/NotFound";
import StoreContext from "./context/StoreContextProvider";
import RequireAuth from "./utils/RequireAuth";
import Layout from "./components/Layout/Layout";
import TopQuantityOfEverybook from "./pages/TopQuantityOfEverybook/TopQuantityOfEverybook";
import TopRatingOfFiveBooks from "./pages/TopRatingOfFiveBooks/TopRatingOfFiveBooks";

const ROLES = {
	SUPER_ADMIN: "SUPER_ADMIN",
	ADMIN: "ADMIN",
	END_USER: "END_USER",
	ANONYMOUS: "ANONYMOUS",
};

const App = () => {
	window.onunload = () => {
		localStorage.removeItem("account");
	};

	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<Home />} />

					<Route path="/contact" element={<Contact />} />

					<Route
						element={<RequireAuth allowedRoles={[ROLES.ANONYMOUS, ROLES.END_USER, ROLES.ADMIN, ROLES.SUPER_ADMIN]} />}
					>
						<Route path="/books" element={<ListOfBooks />} />

						<Route path="/books/:id" element={<DetailOfBook />} />

						<Route path="/search" element={<SearchBook />} />

						<Route path="/signin" element={<SignIn />} />

						<Route path="/signup" element={<SignUp />} />

						<Route path="/profile" element={<Profile />} />
					</Route>

					<Route element={<RequireAuth allowedRoles={[ROLES.SUPER_ADMIN]} />}>
						<Route path="/stats" element={<Stats />} />
						<Route path="/topQuantityOfEverybook" element={<TopQuantityOfEverybook />} />
						<Route path="/topRatingOfFiveBooks" element={<TopRatingOfFiveBooks />} />
					</Route>

					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</>
	);
};

export default App;
