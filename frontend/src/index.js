import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StoreContextProvider } from "./context/StoreContextProvider";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<StoreContextProvider>
				<App />
			</StoreContextProvider>
		</BrowserRouter>
	</React.StrictMode>
);
