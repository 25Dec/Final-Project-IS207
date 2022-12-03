import { useState, useRef, useContext } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import StoreContext from "../../context/StoreContextProvider";

import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
	let [firstname, setFirstname] = useState("");
	let [lastname, setLastname] = useState("");
	let [username, setUsername] = useState("");
	let [newPassword, setNewPassword] = useState("");
	let [email, setEmail] = useState("");
	let SignUp = useRef();
	let { auth, setAuth } = useContext(StoreContext);

	// let { setAuth } = useAuth();
	// let navigate = useNavigate();
	// let location = useLocation();
	// let from = location.state.from.pathname || "/";

	let handleShowIconShowPassword = (e) => {
		let iconShowPassword = e.target.nextElementSibling;
		if (e.target.value === "") {
			iconShowPassword.style.display = "none";
		} else {
			iconShowPassword.style.display = "block";
		}
		setNewPassword(e.target.value);
	};

	const [isShowPassword, setIsShowPassword] = useState(false);
	let handleClickShowPassword = () => {
		setIsShowPassword(!isShowPassword);
	};

	let toggleSignUpPopup = (e) => {
		if (e.target === e.currentTarget) SignUp.current.classList.toggle("hide");
	};

	let handleSignUp = async (e) => {
		e.preventDefault();
	};

	return (
		<div id="SignUp" className="hide" ref={SignUp} onClick={toggleSignUpPopup}>
			<div id="SignUpForm">
				<form onSubmit={handleSignUp}>
					<table>
						<thead>
							<tr>
								<th colSpan={2}>
									<p>SIGN UP</p>
								</th>
							</tr>
							<tr>
								<th colSpan={2}>
									<small>It's quick and easy</small>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<input
										type="text"
										placeholder="First name"
										required
										id="inputFirstname"
										value={firstname}
										onChange={(e) => {
											setFirstname(e.target.value);
										}}
									/>
								</td>
								<td>
									<input
										type="text"
										placeholder="Last name"
										required
										id="inputLastname"
										value={lastname}
										onChange={(e) => {
											setLastname(e.target.value);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<input
										type="text"
										placeholder="Username"
										required
										id="inputUsername"
										value={username}
										onChange={(e) => {
											setUsername(e.target.value);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<input
										type={isShowPassword ? "text" : "password"}
										placeholder="New password"
										required
										id="inputNewPassword"
										value={newPassword}
										onChange={handleShowIconShowPassword}
									/>
									<span className="icon showPassword" onClick={handleClickShowPassword}>
										{isShowPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
									</span>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<input
										type="email"
										placeholder="Email"
										id="inputEmail"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<button>Sign up</button>
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
