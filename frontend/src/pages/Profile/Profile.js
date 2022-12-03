import { useEffect, useContext } from "react";
import EditProfile from "../../components/EditProfile/EditProfile";
import AuthContext from "../../context/StoreContextProvider";
import "./Profile.css";

const Profile = () => {
	let { auth } = useContext(AuthContext);

	let toggleEditProfile = () => {
		let editProfileSection = document.getElementById("EditProfile");
		editProfileSection.classList.toggle("hide");
	};

	useEffect(() => {
		let elToShow = document.querySelectorAll("#Profile .show-on-scroll");

		let isElInViewPort = (el) => {
			let rect = el.getBoundingClientRect();
			let viewHeight = window.innerHeight || document.documentElement.clientHeight;

			return (
				(rect.top <= 0 && rect.bottom >= 0) ||
				(rect.bottom >= viewHeight && rect.top <= viewHeight) ||
				(rect.top >= 0 && rect.bottom <= viewHeight)
			);
		};

		function loop() {
			elToShow.forEach((item) => {
				if (isElInViewPort(item)) {
					item.classList.add("start");
				} else {
					item.classList.remove("start");
				}
			});
		}

		window.onscroll = loop;

		loop();
	}, []);

	return (
		<div id="Profile">
			<h1>My Profile</h1>
			<div className="ProfileCard show-on-scroll left-to-right">
				<div>
					<p>
						<span>First name:</span> <span>{auth.firstName}</span>
					</p>
					<p>
						<span>Last name:</span> <span>{auth.lastName}</span>
					</p>
					<p>
						<span>Email: </span>
						<span>{auth.email}</span>
					</p>
				</div>
				<button onClick={toggleEditProfile}>Edit</button>
			</div>
			<EditProfile />
		</div>
	);
};

export default Profile;
