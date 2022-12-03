import { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { RiEditBoxLine, RiDeleteBinLine } from "react-icons/ri";
import StoreContext from "../../context/StoreContextProvider";
import DeleteBook from "../../components/DeleteBook/DeleteBook";
import axios from "axios";
import "./ListOfBooks.css";

const ListOfBooks = () => {
	let { auth, books, setBooks, setBookId } = useContext(StoreContext);

	let fetchData = async () => {
		// let booksResponse = await axios.get("https://userbookbackendapi.herokuapp.com/v1/auth/books/", {
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		access_token: JSON.parse(localStorage.getItem("account")).token,
		// 	},
		// });
		// setBooks(booksResponse.data.data);
	};

	useEffect(() => {
		fetchData();

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

	let toggleDeleteBook = () => {
		let deleteBookSection = document.getElementById("DeleteBook");
		deleteBookSection.classList.toggle("hide");
	};

	return (
		<div id="ListOfBooks">
			<h1>List of all books</h1>
			<table>
				<thead>
					<tr>
						<th>No.</th>
						<th>Name of book</th>
						<th>Author</th>
						<th>Status</th>
						<th>Quantity</th>
						{auth.userRight === "SUPER_ADMIN" ? <th>Edit / Delete</th> : ""}
					</tr>
				</thead>
				<tbody>
					{books ? (
						<>
							{books.map((book, index) => {
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
										<td>
											<p className={book.status === "NEW" ? "status new" : "status old"}>{book.status}</p>
										</td>
										<td className="quantity">{book.quantity}</td>
										{auth.userRight === "SUPER_ADMIN" ? (
											<td className="modify">
												<NavLink to={`/books/${book.id}`}>
													<RiEditBoxLine className="edit" />
												</NavLink>
												/{" "}
												<RiDeleteBinLine
													className="delete"
													onClick={() => {
														toggleDeleteBook();
														setBookId(book.id);
													}}
												/>
											</td>
										) : (
											""
										)}
									</tr>
								);
							})}
						</>
					) : (
						""
					)}
				</tbody>
			</table>
			<DeleteBook />
		</div>
	);
};

export default ListOfBooks;
