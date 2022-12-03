import { useEffect } from "react";
import "./Home.css";

const Home = () => {
	useEffect(() => {
		let elToShow = document.querySelectorAll("#Home .show-on-scroll");

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
	}, []);

	return (
		<div id="Home">
			<div className="show-on-scroll top-to-bottom">
				<h1>Welcome to our website</h1>
				<h2>Here you can search for the books you want if they are in our database!</h2>
			</div>
		</div>
	);
};

export default Home;
