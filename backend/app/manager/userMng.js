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
	getOne: function (accessUserId, accessUserRight, userId, callback) {
		try {
			if (!Pieces.VariableBaseTypeChecking(userId, "string") || !Validator.isMongoId(userId)) {
				return callback(8, "invalid_id", 400, "user id is not a mongo id string", null);
			}

			if (accessUserId !== userId && Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0) {
				return callback(8, "invalid_right", 403, null, null);
			}

			let query = {};
			let options = { password: 0, resetPasswordToken: 0, updater: 0 };
			let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
			let lowerUserRightList = [];
			if (userRightIdx > 0) {
				lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
			}

			if (accessUserId !== userId) {
				query.userRight = { $in: lowerUserRightList };
			}
			query._id = userId;

			User.findOne(query, options, function (error, user) {
				if (error) {
					return callback(8, "find_fail", 420, error, null);
				}

				if (!user) {
					return callback(8, "unavailable", 404, null, null);
				} else {
					return callback(null, null, 200, null, user);
				}
			});
		} catch (error) {
			return callback(8, "get_fail", 400, error, null);
		}
	},

	getAll: function (accessUserId, accessUserRight, queryContent, callback) {
		try {
			if (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0) {
				return callback(8, "invalid_right", 400, null, null);
			}

			let condition = {};
			let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
			let lowerUserRightList = [];
			if (userRightIdx > 0) {
				lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
			}

			let statusWithoutDel = Constant.STATUS_ENUM.slice(0, Constant.STATUS_ENUM.length);
			statusWithoutDel.splice(2, 1);

			condition.userRight = { $in: lowerUserRightList };

			this.parseFilter(accessUserId, accessUserRight, condition, queryContent.filter);
			if (Pieces.VariableBaseTypeChecking(queryContent.q, "string")) {
				condition["$text"] = { $search: queryContent.q };
			}

			let options = {};
			options.criteria = condition;
			options.keys = { password: 0, resetPasswordToken: 0 };

			User.pagedFind(options, queryContent, function (error, results) {
				if (error) {
					return callback(8, "finds_fail", 420, error, null);
				}
				return callback(null, null, 200, null, results);
			});
		} catch (error) {
			return callback(8, "gets_fail", 400, error, null);
		}
	},

	update: function (accessUserId, accessUserRight, accessLoginName, userId, updateData, callback) {
		try {
			console.log(userId);
			if (!Pieces.VariableBaseTypeChecking(userId, "string") || !Validator.isMongoId(userId)) {
				return callback(8, "invalid_id", 400, "user id is not a mongo id string", null);
			}

			if (accessUserId !== userId && Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0) {
				return callback(8, "invalid_right", 403, null, null);
			}

			let query = {};
			let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
			let lowerUserRightList = [];
			if (userRightIdx > 0) {
				lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
			}

			if (accessUserId !== userId) {
				query.userRight = { $in: lowerUserRightList };
			}
			query._id = userId;

			let update = {};

			update.updater = accessUserId;

			if (
				Pieces.VariableBaseTypeChecking(updateData.loginName, "string") &&
				Validator.isAlphanumeric(updateData.loginName) &&
				Validator.isLowercase(updateData.loginName) &&
				Validator.isLength(updateData.loginName, { min: 4, max: 64 })
			) {
				update.loginName = updateData.loginName;
			}

			if (
				Pieces.VariableBaseTypeChecking(updateData.displayName, "string") &&
				Validator.isLength(updateData.displayName, { min: 4, max: 64 })
			) {
				update.displayName = updateData.displayName;
			}

			if (
				Pieces.VariableBaseTypeChecking(updateData.password, "string") &&
				Validator.isLength(updateData.password, { min: 4, max: 64 })
			) {
				update.password = BCrypt.hashSync(updateData.password, 10);
			}

			if (
				Pieces.VariableBaseTypeChecking(updateData.fullName, "string") &&
				Validator.isLength(updateData.fullName, { min: 4, max: 64 })
			) {
				update.fullName = updateData.fullName;
			}

			if (Pieces.VariableBaseTypeChecking(updateData.email, "string") && Validator.isEmail(updateData.email)) {
				update.email = updateData.email;
			}

			if (Pieces.VariableEnumChecking(updateData.status, Constant.STATUS_ENUM)) {
				update.status = updateData.status;
			}

			if (Pieces.VariableEnumChecking(updateData.userRight, Constant.USER_RIGHT_ENUM)) {
				update.userRight = updateData.userRight;
			}

			update.profile = {};

			if (
				Pieces.VariableBaseTypeChecking(updateData.language, "string") &&
				Validator.isLength(updateData.language, { min: 2, max: 2 })
			) {
				update.profile.language = updateData.language;
			}

			let options = {
				upsert: false,
				new: true,
				setDefaultsOnInsert: true,
				projection: { password: false, socialNetwork: false },
			};

			User.findOneAndUpdate(query, update, options, function (error, user) {
				if (error) {
					return callback(8, "find_update_fail", 420, error, null);
				}

				if (user) {
					return callback(null, null, 200, null, user);
				} else {
					return callback(8, "unavailable", 400, null, null);
				}
			});
		} catch (error) {
			return callback(8, "update_fail", 400, error, null);
		}
	},

	delete: function (accessUserId, accessUserRight, userId, callback) {
		try {
			if (!Pieces.VariableBaseTypeChecking(userId, "string") || !Validator.isMongoId(userId)) {
				return callback(8, "invalid_id", 400, "user id is not a mongo id string");
			}

			if (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0) {
				return callback(8, "invalid_right", 403, null);
			}

			let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
			let lowerUserRightList = [];
			if (userRightIdx > 0) {
				lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
			}

			let query = { _id: userId, userRight: { $in: lowerUserRightList } };
			let update = { status: Constant.STATUS_ENUM[2] };
			let options = { upsert: false, new: false, setDefaultsOnInsert: true };

			User.findOneAndUpdate(query, update, options, function (error, user) {
				if (error) {
					return callback(8, "find_update_fail", 420, error);
				} else {
					if (user && user.status === Constant.STATUS_ENUM[2]) {
						user.remove(function (error) {
							if (error) {
								return callback(8, "remove_fail", 420, error);
							}
							return callback(null, null, 200, null);
						});
					} else {
						return callback(null, null, 200, null);
					}
				}
			});
		} catch (error) {
			return callback(8, "delete_fail", 400, error);
		}
	},

	authenticate: function (loginName, password, callback) {
		console.log(loginName);
		console.log(password);
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

	checkUserValidAvailable: function (accessUserId, accessUserRight, accessLoginName, callback) {
		try {
			if (
				!Pieces.VariableBaseTypeChecking(accessUserId, "string") ||
				!Validator.isMongoId(accessUserId) ||
				!Pieces.VariableBaseTypeChecking(accessUserRight, "string") ||
				!Pieces.VariableBaseTypeChecking(accessLoginName, "string")
			) {
				return callback(8, "invalid_data", 400, "user information is incorrect", null);
			}

			User.findOne(
				{ loginName: accessLoginName, _id: accessUserId, status: Constant.STATUS_ENUM[0], userRight: accessUserRight },
				function (error, user) {
					if (error) {
						return callback(8, "find_fail", 420, error, null);
					}
					//console.log(user);
					if (!user) {
						return callback(8, "unavailable", 404, "has no user match to your condition", null);
					} else {
						return callback(null, null, 200, null, user);
					}
				}
			);
		} catch (error) {
			return callback(8, "check_valid_available_fail", 400, error, null);
		}
	},

	createByAdmin: function (accessUserId, accessUserRight, accessLoginName, userData, callback) {
		try {
			if (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0) {
				return callback(8, "invalid_right", 403, "you must be admin to do this process", null);
			}
			if (
				!Pieces.VariableBaseTypeChecking(userData.loginName, "string") ||
				!Validator.isAlphanumeric(userData.loginName) ||
				!Validator.isLowercase(userData.loginName) ||
				!Validator.isLength(userData.loginName, { min: 4, max: 128 })
			) {
				return callback(
					8,
					"invalid_loginName",
					400,
					"login name should be alphanumeric, lowercase and length 4-128",
					null
				);
			}

			if (!Pieces.VariableBaseTypeChecking(userData.password, "string")) {
				return callback(8, "invalid_password", 400, "password is not a string", null);
			}

			if (!Pieces.VariableBaseTypeChecking(userData.email, "string") || !Validator.isEmail(userData.email)) {
				return callback(8, "invalid_email", 400, "email is incorrect format", null);
			}

			let oNewUser = new User();

			let hashOfPass = BCrypt.hashSync(userData.password, 10);
			oNewUser.loginName = userData.loginName;
			oNewUser.email = userData.email;
			oNewUser.password = hashOfPass;

			if (Pieces.VariableEnumChecking(userData.status, Constant.STATUS_ENUM)) {
				oNewUser.status = userData.status;
			} else {
				oNewUser.status = Constant.STATUS_ENUM[0];
			}

			if (Pieces.VariableEnumChecking(userData.userRight, Constant.USER_RIGHT_ENUM)) {
				if (Constant.USER_RIGHT_ENUM.indexOf(accessUserRight) <= Constant.USER_RIGHT_ENUM.indexOf(userData.userRight)) {
					return callback(8, "invalid_right", 403, "you have no right to do this", null);
				}
				oNewUser.userRight = userData.userRight;
			}

			if (Pieces.VariableBaseTypeChecking(userData.displayName, "string")) {
				oNewUser.displayName = userData.displayName;
			} else {
				oNewUser.displayName = userData.loginName;
			}

			if (Pieces.VariableBaseTypeChecking(userData.fullName, "string")) {
				oNewUser.fullName = userData.fullName;
			} else {
				oNewUser.fullName = userData.loginName;
			}

			oNewUser.save(function (error) {
				if (error) {
					return callback(8, "save_fail", 420, error, null);
				}
				return callback(null, null, 200, null, oNewUser);
			});
		} catch (error) {
			return callback(8, "create_by_admin_fail", 400, error, null);
		}
	},
	// orther cái này là show ra các user
	parseFilter: function (accessUserId, accessUserRight, condition, filters) {
		try {
			if (!Pieces.VariableBaseTypeChecking(filters, "string") || !Validator.isJSON(filters)) {
				return false;
			}

			let aDataFilter = Pieces.safelyParseJSON1(filters);
			if (aDataFilter && aDataFilter.length > 0) {
				for (let i = 0; i < aDataFilter.length; i++) {
					if (
						!Pieces.VariableBaseTypeChecking(aDataFilter[i].key, "string") ||
						!Pieces.VariableBaseTypeChecking(aDataFilter[i].operator, "string") ||
						aDataFilter[i].value === null ||
						aDataFilter[i].value === undefined
					) {
						continue;
					}

					if (
						aDataFilter[i].key === "isAlive" &&
						(aDataFilter[i].operator === "=" || aDataFilter[i].operator === "!=") &&
						Pieces.VariableBaseTypeChecking(aDataFilter[i].value, "boolean")
					) {
						switch (aDataFilter[i].operator) {
							case "=":
								condition[aDataFilter[i].key] = aDataFilter[i].value;
								break;
							case "!=":
								condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
								break;
						}
						continue;
					}

					if (
						aDataFilter[i].key === "status" &&
						(aDataFilter[i].operator === "=" || aDataFilter[i].operator === "!=") &&
						Pieces.VariableEnumChecking(aDataFilter[i].value, Constant.STATUS_ENUM)
					) {
						switch (aDataFilter[i].operator) {
							case "=":
								condition[aDataFilter[i].key] = aDataFilter[i].value;
								break;
							case "!=":
								condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
								break;
						}
						continue;
					}

					if (
						aDataFilter[i].key === "createdAt" &&
						(aDataFilter[i].operator === "=" ||
							aDataFilter[i].operator === "!=" ||
							aDataFilter[i].operator === "<" ||
							aDataFilter[i].operator === ">" ||
							aDataFilter[i].operator === "<=" ||
							aDataFilter[i].operator === ">=" ||
							aDataFilter[i].operator === "in")
					) {
						if (
							aDataFilter[i].operator !== "in" &&
							Pieces.VariableBaseTypeChecking(aDataFilter[i].value, "string") &&
							Validator.isISO8601(aDataFilter[i].value)
						) {
							switch (aDataFilter[i].operator) {
								case "=":
									condition[aDataFilter[i].key] = { $eq: aDataFilter[i].value };
									break;
								case "!=":
									condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
									break;
								case ">":
									condition[aDataFilter[i].key] = { $gt: aDataFilter[i].value };
									break;
								case ">=":
									condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value };
									break;
								case "<":
									condition[aDataFilter[i].key] = { $lt: aDataFilter[i].value };
									break;
								case "<=":
									condition[aDataFilter[i].key] = { $lte: aDataFilter[i].value };
									break;
							}
						} else if (aDataFilter[i].operator === "in") {
							if (
								aDataFilter[i].value.length === 2 &&
								Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], "string") &&
								Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], "string") &&
								Validator.isISO8601(aDataFilter[i].value[0]) &&
								Validator.isISO8601(aDataFilter[i].value[1])
							) {
								condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
							}
						}
						continue;
					}

					if (
						aDataFilter[i].key === "updatedAt" &&
						(aDataFilter[i].operator === "=" ||
							aDataFilter[i].operator === "!=" ||
							aDataFilter[i].operator === "<" ||
							aDataFilter[i].operator === ">" ||
							aDataFilter[i].operator === "<=" ||
							aDataFilter[i].operator === ">=" ||
							aDataFilter[i].operator === "in")
					) {
						if (
							aDataFilter[i].operator !== "in" &&
							Pieces.VariableBaseTypeChecking(aDataFilter[i].value, "string") &&
							Validator.isISO8601(aDataFilter[i].value)
						) {
							switch (aDataFilter[i].operator) {
								case "=":
									condition[aDataFilter[i].key] = { $eq: aDataFilter[i].value };
									break;
								case "!=":
									condition[aDataFilter[i].key] = { $ne: aDataFilter[i].value };
									break;
								case ">":
									condition[aDataFilter[i].key] = { $gt: aDataFilter[i].value };
									break;
								case ">=":
									condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value };
									break;
								case "<":
									condition[aDataFilter[i].key] = { $lt: aDataFilter[i].value };
									break;
								case "<=":
									condition[aDataFilter[i].key] = { $lte: aDataFilter[i].value };
									break;
							}
						} else if (aDataFilter[i].operator === "in") {
							if (
								aDataFilter[i].value.length === 2 &&
								Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], "string") &&
								Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], "string") &&
								Validator.isISO8601(aDataFilter[i].value[0]) &&
								Validator.isISO8601(aDataFilter[i].value[1])
							) {
								condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
							}
						}
					}
				}
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}
	},
};
