/**
 * Created by SugarTawng on 9/11/2022
 */

const oUserCtrl = require('../controllers/userCtrl');

module.exports = function (app) {
    /**
     * @api {POST} /v1/login Login
     * @apiVersion 1.0.0
     * @apiName login
     * @apiGroup User
     * @apiPermission Every one
     *
     * @apiDescription login and get access token
     *
     * @apiParam {string} id a int with length <= 10
     * @apiParam {String} code a string with 4 < length < 64
     *
     * @apiExample Example usage:
     * curl -i https://conntomongodb.herokuapp.com/v1/login
     *
     * @apiSuccess {object} data the user data with token
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *          "token": "abc",
     *          "id":2,
     *          "loginName": "bioz",
     *          "displayName": "bioz",
     *          "email": ilovebioz@gmail.com
     *       },
     *       "result": "ok",
     *       "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "result": "fail",
     *       "message": "invalid input"
     *     }
     */
    app.post('/v1/login', oUserCtrl.login);
}