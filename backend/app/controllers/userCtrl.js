/**
 * Created by SugarTawng on 9/11/2022
 */
// third party components
const JsonWebToken = require('jsonwebtoken');

// our components
const GConfig = require('../configs/gConfig');
const UserManager = require('../manager/userMng.js');
const Rest = require('../utils/restware');
const {updatePassword} = require("../manager/userMng");

module.exports = {
    login: function (req, res) {
        let loginName = req.body.loginName || '';
        let password = req.body.password || '';

        UserManager.authenticate(loginName, password, function (errorCode, errorMessage, httpCode, errorDescription, user) {
            if (errorCode) {
                return Rest.sendError( res, errorCode, errorMessage, httpCode, errorDescription );
            }
            JsonWebToken.sign({ id: user._id, loginName: user.loginName, email: user.email, userRight: user.userRight }, GConfig.authenticationkey, { expiresIn: '25 days' }, function(error, token) {
                if(error)
                {
                    return Rest.sendError( res, 1, 'create_token_error', 400, error );
                }else{
                    return Rest.sendSuccessToken(res, token, user);
                }
            });
        });
    },

}