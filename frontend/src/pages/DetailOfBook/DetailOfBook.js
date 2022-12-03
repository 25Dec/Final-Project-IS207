import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { RiEditBoxLine } from "react-icons/ri";
import Spinner from "../../components/Spinner/Spinner";
import EditBook from "../../components/EditBook/EditBook";
import StoreContext from "../../context/StoreContextProvider";
import axios from "axios";
import "./DetailOfBook.css";

const DetailOfBook = () => {
	let { id } = useParams();
	let [book, setBook] = useState();
	let { auth } = useContext(StoreContext);

	useEffect(() => {
		let elToShow = document.querySelectorAll("#DetailOfBook .show-on-scroll");

		let isElInViewPort = (el) => {
			let rect = el.getBoundingClientRect();
			let viewHeight = window.innerHeight || document.documentElement.clientHeight;

			return (
				(rect.left <= 0 && rect.right >= 0) ||
				(rect.right >= viewHeight && rect.left <= viewHeight) ||
				(rect.left >= 0 && rect.right <= viewHeight)
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

	let fetchData = async () => {
		let response = await axios.get(`https://userbookbackendapi.herokuapp.com/v1/auth/books/${id}`, {
			headers: {
				access_token: auth.token,
			},
		});
		setBook(response.data);
	};

	useEffect(() => {
		fetchData();
	}, [id]);

	let toggleEditBook = () => {
		let editBookSection = document.getElementById("EditBook");
		editBookSection.classList.toggle("hide");
	};

	return (
		<div id="DetailOfBook">
			<h1>Detail of book</h1>
			{book ? (
				<>
					<div className="book show-on-scroll top-to-bottom">
						<div className="header">
							<h1>{book.bookName}</h1>
							{auth.userRight === "SUPER_ADMIN" ? <RiEditBoxLine className="edit" onClick={toggleEditBook} /> : ""}
						</div>
						<div className="body">
							<p>
								<span>Author name:</span> <span>{book.authorName}</span>
							</p>
							<p>
								<span>Category: </span> <span>{book.category}</span>
							</p>
							<p>
								<span>Description:</span> Not available
							</p>
							<p>
								<span>Quantity:</span> <span>{book.quantity}</span>
							</p>
							<p>
								<span>Publishing year:</span> <span>{book.yearPublication}</span>
							</p>
							<p>
								<span>Rating:</span> <span>{book.rating}</span>
							</p>
							<p>
								<span>Status:</span> <span>{book.status}</span>
							</p>
						</div>
						<div className="footer">
							<small>Created at: {book.createdAt}</small>
							<small>Last updated at: {book.updatedAt}</small>
						</div>
					</div>
					<EditBook book={book} />
				</>
			) : (
				<Spinner />
			)}
		</div>
	);
};

export default DetailOfBook;
