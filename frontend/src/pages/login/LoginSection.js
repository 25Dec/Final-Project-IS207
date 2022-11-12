import React, { useRef } from "react";
import LoginForm from "./LoginForm";
import "./Login.css";

const LoginSection = () => {
	const LoginSection = useRef();
	console.log(LoginSection.current);
	return (
		<div id="LoginSection" ref={LoginSection}>
			<LoginForm />
		</div>
	);
};

export default LoginSection;
