import { useState, useRef, useContext } from "react";
import StoreContext from "../../context/StoreContextProvider";
import axios from "axios";
import "./EditProfile.css";

const EditProfile = () => {
	let { auth, setAuth, setStatus, setMsg } = useContext(StoreContext);
	let [firstName, setFirstname] = useState(auth.firstName);
	let [lastName, setLastname] = useState(auth.lastName);
	let [email, setEmail] = useState(auth.email);
	let EditProfile = useRef();

	let toggleEditProfilePopup = (e) => {
		if (e.target === e.currentTarget) EditProfile.current.classList.toggle("hide");
	};

	let handleSubmit = async (e) => {
		e.preventDefault();

		let newValues = { ...auth, firstName, lastName, email };

		try {
			let response = await axios.put(
				`https://userbookbackendapi.herokuapp.com/v1/auth/users/${JSON.parse(localStorage.getItem("account")).id}`,
				newValues,
				{
					headers: {
						"Content-Type": "application/json",
						access_token: auth.token,
					},
				}
			);

			setAuth(newValues);
			localStorage.setItem("account", JSON.stringify(newValues));
			setStatus("success");
			setMsg("Edit successed!");
		} catch (err) {
			setStatus("error");
			setMsg("Edit failed!");
		}

		EditProfile.current.classList.add("hide");
	};

	return (
		<div id="EditProfile" className="hide" ref={EditProfile} onClick={toggleEditProfilePopup}>
			<div id="EditProfileForm">
				<form onSubmit={handleSubmit}>
					<table>
						<thead>
							<tr>
								<th colSpan={2}>
									<p>EDIT PROFILE</p>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={2}>
									<input
										type="text"
										placeholder="First name"
										required
										id="inputFirstname"
										value={firstName}
										onChange={(e) => {
											setFirstname(e.target.value);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<input
										type="text"
										placeholder="Last name"
										required
										id="inputLastname"
										value={lastName}
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
										placeholder="Email"
										required
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
									<button>Submit</button>
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
