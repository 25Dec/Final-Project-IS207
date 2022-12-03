import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import StoreContext from "../../context/StoreContextProvider";
import axios from "axios";
import "./Stats.css";

const Stats = () => {
	let {
		auth,
		numberOfTitles,
		setNumberOfTitles,
		topQuantityOfEverybook,
		setTopQuantityOfEverybook,
		topRatingOfFiveBooks,
		setTopRatingOfFiveBooks,
	} = useContext(StoreContext);

	let fetchData = async () => {
		try {
			let response1 = await axios.get(`https://userbookbackendapi.herokuapp.com/v1/auth/statistics/book/overall`, {
				headers: {
					access_token: auth.token,
				},
			});

			setNumberOfTitles(response1.data);

			let response2 = await axios.get(`https://userbookbackendapi.herokuapp.com/v1/auth/topquantity`, {
				headers: {
					access_token: auth.token,
				},
			});

			setTopQuantityOfEverybook(response2.data);

			let response3 = await axios.get(`https://userbookbackendapi.herokuapp.com/v1/auth/toprating`, {
				headers: {
					access_token: auth.token,
				},
			});

			setTopRatingOfFiveBooks(response3.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div id="Stats">
			<h1>Stats</h1>
			<div>
				<div className="NumberOfTitles">
					<h2>Number of titles</h2>
					<p>{numberOfTitles ? numberOfTitles : "No data found"}</p>
				</div>
				<div className="TopQuantityOfEveryBook">
					<h2>Top quantity of everybook</h2>
					{topQuantityOfEverybook.length ? (
						<NavLink to="/topQuantityOfEverybook">See details</NavLink>
					) : (
						"No data found"
					)}
				</div>
				<div className="TopRatingOfFiveBook">
					<h2>Top rating of five books</h2>
					{topRatingOfFiveBooks.length ? <NavLink to="/topRatingOfFiveBooks">See details</NavLink> : "No data found"}
				</div>
			</div>
		</div>
	);
};

export default Stats;
