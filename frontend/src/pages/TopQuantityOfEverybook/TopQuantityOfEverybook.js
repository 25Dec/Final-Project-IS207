import { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import StoreContext from "../../context/StoreContextProvider";
import "./TopQuantityOfEverybook.css";

const TopQuantityOfEverybook = () => {
	let { topQuantityOfEverybook } = useContext(StoreContext);

	useEffect(() => {
		let elToShow = document.querySelectorAll(".show-on-scroll");

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
		<div id="TopQuantityOfEverybook">
			<h1>Top Quantity Of Everybook</h1>
			<table>
				<thead>
					<tr>
						<th>No.</th>
						<th>Name of book</th>
						<th>Author</th>
						<th>Quantity</th>
					</tr>
				</thead>
				<tbody>
					{topQuantityOfEverybook ? (
						<>
							{topQuantityOfEverybook.map((book, index) => {
								return (
									<tr
										key={book.id}
										className={
											index % 2 === 0 ? "row show-on-scroll left-to-right" : "row show-on-scroll right-to-left"
										}
									>
										<td className="no">{index + 1}</td>
										<td>
											<NavLink className="bookName" to={`/books/${book.id}`}>
												{book.bookName}
											</NavLink>
										</td>
										<td className="authorName">{book.authorName}</td>
										<td className="quantity">{book.quantity}</td>
									</tr>
								);
							})}
						</>
					) : (
						<Spinner />
					)}
				</tbody>
			</table>
		</div>
	);
};

export default TopQuantityOfEverybook;
