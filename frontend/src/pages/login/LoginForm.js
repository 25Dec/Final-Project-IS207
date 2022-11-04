import React from "react";
import { useState, useEffect } from "react";
import { AiOutlineUser, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import "./Login.css";

const LoginForm = () => {
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
	let handleLogin = (e) => {
		e.preventDefault();
	};
	// HTML Template
	return (
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
								<input type="text" placeholder="Username" required id="inputUserName" />
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
	);
};

export default LoginForm;
