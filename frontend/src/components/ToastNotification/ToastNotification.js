import { useState, useEffect, useContext } from "react";
import StoreContext from "../../context/StoreContextProvider";
import "./ToastNotification.css";

const ToastNotification = () => {
	let { isAuthorized, status, msg } = useContext(StoreContext);

	let [toasts, setToasts] = useState({
		signIn: {
			icon: '<i class="fas fa-check-circle"></i>',
			msg: "You've been signed in!",
		},
		signOut: {
			icon: '<i class="fas fa-circle-exclamation"></i>',
			msg: "You've been signed out!",
		},
		success: {
			icon: '<i class="fas fa-check-circle"></i>',
			msg: "",
		},
		error: {
			icon: '<i class="fas fa-exclamation-triangle"></i>',
			msg: "",
		},
		warning: {
			icon: '<i class="fas fa-exclamation-circle"></i>',
			msg: "",
		},
	});

	function createToast(status, msg = "") {
		if (status == "") status = "success";

		let toast = document.createElement("div");
		toast.className = `toast ${status}`;
		toast.innerHTML = `${toasts[status].icon}
							<span class="msg">${toasts[status].msg}</span>
							<span class="countdown"></span>`;
		document.querySelector("#ToastNotification").appendChild(toast);
		setTimeout(() => {
			toast.style.animation = "hide_slide 1s ease forwards";
		}, 3000);
		setTimeout(() => {
			toast.remove();
		}, 5000);
	}

	useEffect(() => {
		if (status === "success" && toasts[status].msg === "")
			setToasts({ ...toasts, success: { ...toasts[status], msg } });
		else if (status === "success" && toasts[status].msg !== "") {
			setToasts({ ...toasts, success: { ...toasts[status], msg: "" } });
			setToasts({ ...toasts, success: { ...toasts[status], msg } });
		} else if (status === "error" && toasts[status].msg === "")
			setToasts({ ...toasts, error: { ...toasts[status], msg } });
		else if (status === "error" && toasts[status].msg !== "") {
			setToasts({ ...toasts, success: { ...toasts[status], msg: "" } });
			setToasts({ ...toasts, success: { ...toasts[status], msg } });
		} else if (status === "warning" && toasts[status].msg === "")
			setToasts({ ...toasts, warning: { ...toasts[status], msg } });
		else if (status === "warning" && toasts[status].msg !== "") {
			setToasts({ ...toasts, success: { ...toasts[status], msg: "" } });
			setToasts({ ...toasts, success: { ...toasts[status], msg } });
		}
		createToast(status, msg);
	}, [isAuthorized, status, msg]);

	return <div id="ToastNotification"></div>;
};

export default ToastNotification;
