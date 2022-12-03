import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { RiEditBoxLine, RiDeleteBinLine } from "react-icons/ri";
import AuthContext from "../../context/StoreContextProvider";
import Spinner from "../../components/Spinner/Spinner";
import DeleteBook from "../../components/DeleteBook/DeleteBook";
import axios from "axios";
import "./SearchBook.css";

const SearchBook = () => {
	let { books, auth, setBooks, setBookId } = useContext(AuthContext);
	let [nameOfBook, setNameOfBook] = useState("");
	let [author, setAuthor] = useState("");
	let [categories, setCategories] = useState([
		{
			name: "Romance",
			value: "romance",
			checked: true,
		},
		{
			name: "Mystery",
			value: "mystery",
			checked: true,
		},
		{
			name: "Fantasy & Science fiction",
			value: "fantasyScienceFiction",
			checked: true,
		},
		{
			name: "Thrillers & Horror",
			value: "thrillersHorror",
			checked: true,
		},
		{
			name: "Self-help",
			value: "selfHelp",
			checked: true,
		},
		{
			name: "Short Stories",
			value: "shortStories",
			checked: true,
		},
		{
			name: "Cookbooks",
			value: "cookbooks",
			checked: true,
		},
		{
			name: "Essays",
			value: "essays",
			checked: true,
		},
		{
			name: "History",
			value: "history",
			checked: true,
		},
		{
			name: "Unknown",
			value: "unknown",
			checked: true,
		},
		{
			name: "Other",
			value: "other",
			checked: true,
		},
	]);
	let [bookResults, setBookResults] = useState(books);

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
		// fetchData();

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
	});

	useEffect(() => {
		if (nameOfBook.trim() === "" && author.trim() === "") {
			setBookResults(books);
		} else {
			let search1 = books.filter((book) => {
				if (book.bookName.toLowerCase().includes(nameOfBook.toLowerCase().trim())) return book;
			});

			let search2 = search1.filter((book) => {
				if (book.authorName.toLowerCase().includes(author.toLowerCase().trim())) return book;
			});

			setBookResults(search2);
		}
	}, [nameOfBook, author, categories]);

	useEffect(() => {
		let options = categories.filter((category) => {
			return category.checked === true;
		});

		let arr = [];

		for (let book of books) {
			for (let option of options) {
				if (book.category === option.name) arr.push(book);
			}
		}

		setBookResults(arr);
	}, [categories]);

	let toggleDeleteBook = () => {
		let deleteBookSection = document.getElementById("DeleteBook");
		deleteBookSection.classList.toggle("hide");
	};

	return (
		<div id="SearchBook">
			<h1 className="title">Search your book here</h1>
			<div className="options">
				<div className="inputs">
					<div>
						<label htmlFor="inputNameOfBook">Name of book</label>
						<input
							id="inputNameOfBook"
							type="text"
							placeholder="Enter name of book"
							value={nameOfBook}
							onChange={(e) => {
								setNameOfBook(e.target.value);
							}}
						/>
					</div>

					<div>
						<label htmlFor="inputAuthor">Author</label>
						<input
							id="inputAuthor"
							type="text"
							placeholder="Enter author"
							value={author}
							onChange={(e) => {
								setAuthor(e.target.value);
							}}
						/>
					</div>
				</div>
				<label htmlFor="categories">Categories</label>
				<div id="categories">
					{categories.map((category, index) => {
						return (
							<div className="category" key={index}>
								<input
									id={index}
									type="checkbox"
									value={category.value}
									checked={category.checked}
									onChange={(e) => {
										setCategories(
											categories.map((category, index) => {
												if (index == e.target.id) category.checked = !category.checked;
												return category;
											})
										);
									}}
								/>
								<label htmlFor={index}>{category.name}</label>
							</div>
						);
					})}
				</div>
			</div>
			{books ? (
				<>
					{" "}
					<div className="results">
						{bookResults.map((book, index) => {
							return (
								<div
									key={book.id}
									className={index % 2 === 0 ? "row show-on-scroll left-to-right" : "row show-on-scroll right-to-left"}
								>
									<div>
										<NavLink to={`/books/${book.id}`}>{book.bookName}</NavLink>
										<span
											className={
												categories.find((category) => {
													if (category.name === book.category) return category;
												}).value
											}
										>
											{book.category}
										</span>
										{auth.userRight === "SUPER_ADMIN" ? (
											<>
												<NavLink to={`/books/${book.id}`}>
													<RiEditBoxLine className="edit" />
												</NavLink>
												<RiDeleteBinLine
													className="delete"
													onClick={() => {
														toggleDeleteBook();
														setBookId(book.id);
													}}
												/>
											</>
										) : (
											""
										)}
									</div>
									<p>Author: {book.authorName}</p>
									<p>Quantity: {book.quantity}</p>
								</div>
							);
						})}
					</div>
					<DeleteBook />
				</>
			) : (
				<Spinner />
			)}
		</div>
	);
};

export default SearchBook;
