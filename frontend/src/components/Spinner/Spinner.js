import { useState } from "react";
import "./Spinner.css";

const Spinner = () => {
	const [isLoading, setIsLoading] = useState(false);
	return (
		<div id="spinner-container">
			<div className="loading-spinner"></div>
			<div>Loading...Please wait!</div>
		</div>
	);
};

export default Spinner;
