/**
 * Created by SugarTawng on 9/11/2022
 */
// third party components
const BCrypt = require("bcryptjs");
const Validator = require("validator");
const JsonWebToken = require("jsonwebtoken");

// our components
const Constant = require("../configs/constant");
const User = require("../models/user");

const GConfig = require("../configs/gConfig");
const Pieces = require("../utils/pieces");

module.exports = {
	authenticate: function (loginName, password, callback) {
		console.log(loginName, password);
		try {
			if (!Pieces.VariableBaseTypeChecking(loginName, "string")) {
				return callback(8, "invalid_login_name", 422, "loginName is not a string", null);
			}

			if (!Pieces.VariableBaseTypeChecking(password, "string")) {
				return callback(8, "invalid_password", 422, "password is not a string", null);
			}

			User.findOne({ loginName: loginName }, function (error, user) {
				// , status: Constant.STATUS_ENUM[0], isEmailVerify: true
				if (error) {
					return callback(8, "find_fail", 420, error, null);
				}

				if (user) {
					BCrypt.compare(password, user.password, function (error, result) {
						if (result === true) {
							return callback(null, null, 200, null, user);
						} else {
							return callback(8, "incorrect_password", 422, null, null);
						}
					});
				} else {
					return callback(8, "unavailable", 404, null, null);
				}
			});
		} catch (error) {
			return callback(8, "authenticate_fail", 400, error, null);
		}
	},
};
