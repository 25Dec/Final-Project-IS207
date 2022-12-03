/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BiHome, BiUser, BiSearch, BiLogIn, BiUserPlus, BiMessageSquareDots } from "react-icons/bi";
import { ImBooks } from "react-icons/im";
import { IoIosInformationCircleOutline } from "react-icons/io";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";
import ToastNotification from "../ToastNotification/ToastNotification";
import StoreContext from "../../context/StoreContextProvider";
import "./Navbar.css";

const Navbar = () => {
	let { auth, setAuth, isAuthorized, setIsAuthorized, setStatus } = useContext(StoreContext);
	let navigate = useNavigate();

	let toggleSignIn = () => {
		let signInSection = document.getElementById("SignIn");
		signInSection.classList.toggle("hide");
	};

	let toggleSignUp = () => {
		let signUpSection = document.getElementById("SignUp");
		signUpSection.classList.toggle("hide");
	};

	return (
		<>
			<nav>
				<NavLink to="/" end>
					<BiHome />
				</NavLink>

				{auth.userRight === "END_USER" || auth.userRight === "ADMIN" || auth.userRight === "SUPER_ADMIN" ? (
					<NavLink to="/books">
						<ImBooks />
					</NavLink>
				) : (
					""
				)}

				{auth.userRight === "END_USER" || auth.userRight === "ADMIN" || auth.userRight === "SUPER_ADMIN" ? (
					<NavLink to="/search" end>
						<BiSearch />
					</NavLink>
				) : (
					""
				)}

				{auth.userRight === "END_USER" || auth.userRight === "ADMIN" || auth.userRight === "SUPER_ADMIN" ? (
					<NavLink to="/profile" end>
						<BiUser />
					</NavLink>
				) : (
					""
				)}

				{auth.userRight === "SUPER_ADMIN" ? (
					<NavLink to="/stats" end>
						<IoIosInformationCircleOutline />
					</NavLink>
				) : (
					""
				)}

				<NavLink to="/contact" end>
					<BiMessageSquareDots />
				</NavLink>

				<a
					href="#"
					onClick={() => {
						if (isAuthorized) {
							setIsAuthorized(false);
							setAuth({});
							setStatus("signOut");
							localStorage.removeItem("account");
							navigate("/", { replace: true });
						} else toggleSignIn();
					}}
				>
					<BiLogIn />
				</a>

				{/* {isAuthorized ? (
					""
				) : (
					<a href="#" onClick={toggleSignUp}>
						<BiUserPlus />
					</a>
				)} */}
			</nav>
			<SignIn />
			<SignUp />
			<ToastNotification />
		</>
	);
};

export default Navbar;
