import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineUser, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

const LoginForm = () => {
	let [username, setUsername] = useState("");
	let [password, setPassword] = useState("");
	let { setAuth } = useAuth();
	let navigate = useNavigate();
	let location = useLocation();
	let from = location.state.from.pathname || "/";
	/* Xử lí sự kiện khi focus vào ô nhập password sẽ hiện icon show password 
	B1: Mỗi lần nhập password là sẽ lấy ra iconShowPassword
	B2: Kiểm tra gtri bên trong ô inputPassword
		+) Nếu gtri là rỗng thì ẩn iconShowPassword
		+) Nếu gtri ko rỗng thì hiện iconShowPassword
	*/
	let handleShowIconShowPassword = (e) => {
		let iconShowPassword = e.target.nextElementSibling;
		if (e.target.value === "") {
			iconShowPassword.style.display = "none";
		} else {
			iconShowPassword.style.display = "block";
		}
		setPassword(e.target.value);
	};
	/* Xử lí sự kiện show password
	- Mỗi lần bấm icon hình con mắt là sẽ thay đổi state hiện tại của isShowPassword
	*/
	const [isShowPassword, setIsShowPassword] = useState(false);
	let handleClickShowPassword = () => {
		setIsShowPassword(!isShowPassword);
	};
	/* Xử lí sự kiện đăng nhập
	 */
	let handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:3001/v1/login",
				JSON.stringify({ loginName: username, password }),
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			const accessToken = response.data.token;
			const roles = response.data.userRight;
			console.log({ accessToken, roles });
			setAuth({ username, password, roles, accessToken });
			localStorage.setItem("user", JSON.stringify({ accessToken, roles }));
			setUsername("");
			setPassword("");
			navigate(from, { replace: true });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div id="LoginSection">
			<div id="LoginForm">
				<form onSubmit={handleLogin}>
					<table>
						<thead>
							<tr>
								<th colSpan={2}>Books Management</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={2}>
									<span className="icon username">
										<AiOutlineUser />
									</span>
									<input
										type="text"
										placeholder="Username"
										required
										id="inputUserName"
										value={username}
										onChange={(e) => {
											setUsername(e.target.value);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<span className="icon password">
										<AiOutlineLock />
									</span>
									<input
										type={isShowPassword ? "text" : "password"}
										placeholder="Password"
										required
										id="inputPassword"
										value={password}
										onChange={handleShowIconShowPassword}
									/>
									<span className="icon showPassword" onClick={handleClickShowPassword}>
										{isShowPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
									</span>
								</td>
							</tr>
							<tr>
								<td colSpan={2}>
									<button>Sign in</button>
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
