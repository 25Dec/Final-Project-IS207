import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Footer from "./components/footer/Footer";

const App = () => {
	return (
		<div id="App">
			<Login />
			<Footer />
		</div>
	);
};

export default App;
