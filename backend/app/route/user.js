/**
 * Created by SugarTawng on 9/11/2022
 */

const oUserCtrl = require('../controllers/userCtrl');

module.exports = function (app) {
    /**
     * @api {POST} /v1/auth/users Create One
     * @apiVersion 1.0.0
     * @apiName Create by super admin
     * @apiGroup User
     * @apiPermission Super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create user by admin or super admin note cannot create with greater right
     *
     * @apiParam {string} loginName a unique string with 4 <= length <= 64
     * @apiParam {string} displayName a string with 4 <= length <= 64 (Default displayName = loginName)
     * @apiParam {string} email unique email
     * @apiParam {string} password a string with 4 <= length <= 64
     * @apiParam {string} language the language of user use (Default en)
     * @apiParam {string} firstName the firstname of a user, string with 3 <= length <= 256
     * @apiParam {string} lastName the lastname of a user, string with 3 <= length <= 256
     * @apiParam {string} userRight the Right of a user (Default END_USER)
     * @apiParam {string} system define user belong to user system or not (default: false)
     * @apiParam {string} status describe status of user (ACTIVATED', 'DEACTIVATED', 'DELETED', default ACTIVATED)
     * @apiParam {boolean}  isAlive a boolean variable (default: false)
     * @apiParam {object}  createdBy the user create a new user (default by id)
     * @apiParam {object}  updatedBy the user update a old user (default by id)
     * @apiParam {date}  createdAt time when you create new user (default by when you query)
     * @apiParam {date}  updatedAt time when you update new user (default by when you query)
     * @apiExample Example usage:
     * curl -i https://localhost:3001/v1/auth/users
     *
     * @apiSuccess {String} id the ID of created user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data":{
     *           "id": "abc"
     *       },
     *       "result": "ok",
     *       "message": "",
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     * HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.post('/v1/auth/users', oUserCtrl.createByAdmin);
    /**
     * @api {POST} /v1/login Login
     * @apiVersion 1.0.0
     * @apiName Login
     * @apiGroup User
     * @apiPermission Every one not include guess
     *
     * @apiDescription Login and get access token to take more action
     *
     * @apiParam {string} loginName a unique string with 4 < length < 64
     * @apiParam {String} password a string with 4 < length < 64
     *
     * @apiExample Example usage:
     * curl -i https://localhost:3001/v1/login
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
     *          "email": ilovebioz@gmail.com,
     *          "userRight": "SUPER_ADMIN",
     *          "firstName": "System"
     *          "lastName": "Admin"
     *       },
     *       "result": "ok",
     *       "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     * HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.post('/v1/login', oUserCtrl.login);

    /**
     * @api {GET} /v1/auth/users/:id Get One
     * @apiVersion 1.0.0
     * @apiName GetOne
     * @apiGroup User
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get one a user less right and by itself: Example: enduser can get it self, admin can get anonymous and enduser, super admin can get all
     *
     * @apiParam {string} id ID of user, on params
     *
     * @apiExample Example usage:
     * curl -i https://localhost:3001/v1/auth/users/2
     *
     * @apiSuccess {String} id the ID of group
     * @apiSuccess {string} loginName a unique string with 4 <= length <= 64
     * @apiSuccess {string} displayName a string with 4 <= length <= 64 (Default displayName = loginName)
     * @apiSuccess {string} email unique email
     * @apiSuccess {string} password a string with 4 <= length <= 64
     * @apiSuccess {string} language the language of user use (Default en)
     * @apiSuccess {string} firstName the firstname of a user, string with 3 <= length <= 256
     * @apiSuccess {string} lastName the lastname of a user, string with 3 <= length <= 256
     * @apiSuccess {string} userRight the Right of a user (Default END_USER)
     * @apiSuccess {string} system define user belong to user system or not (default: false)
     * @apiSuccess {string} status describe status of user (ACTIVATED', 'DEACTIVATED', 'DELETED', default ACTIVATED)
     * @apiSuccess {boolean}  isAlive a boolean variable (default: false)
     * @apiSuccess {object}  createdBy the user create a new user (default by id)
     * @apiSuccess {object}  updatedBy the user update a old user (default by id)
     * @apiSuccess {date}  createdAt time when you create new user (default by when you query)
     * @apiSuccess {date}  updatedAt time when you update new user (default by when you query)
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2",
     *              "loginName": "bioz",
     *              "email": "ilovebioz@gmail.com",
     *              "activated": "1",
     *              ...
     *          },
     *          "result": "ok",
     *          "message" ""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     * HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.get('/v1/auth/users/:id', oUserCtrl.getOne);
    /**
     * @api {GET} /v1/auth/users Get List
     * @apiVersion 1.0.0
     * @apiName GetAll
     * @apiGroup User
     * @apiPermission Super admin and admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all users in database, admin can see the information, endUser and anonymous, superAdmin can see all role
     *
     * @apiParam {none} noneOfInput nothing input here
     *
     *
     * @apiExample Example usage:
     * curl -i https://localhost:3001/v1/auth/users
     *
     * @apiSuccess {Object[]} data the list of data
     * @apiSuccess {Object} items {begin, end, total}
     * @apiSuccess {Object} pages {current, prev, hasPrev, next, hasNext, total}
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [...],
     *       "pages": {"current": 1, "prev": 3, "hasPrev": true, "next": 5, "hasNext": true, "total": 56},
     *       "items": {"begin": 1, "end": 3, "total": 5},
     *       "result": "ok",
     *       "message": ""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     * HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.get('/v1/auth/users', oUserCtrl.getAll);
    /**
     * @api {PUT} /v1/auth/users/:id Update One
     * @apiVersion 1.0.0
     * @apiName Update
     * @apiGroup User
     * @apiPermission Admin and super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update user information, endUser can update information for it self, admin can endUser, anonymous and itself but can not update admin and super admin, superadmin canupdate every role
     *
     * @apiParam {String} id ID of user, on params
     * @apiParam {string} displayName a string with 4 <= length <= 64 (Default displayName = loginName) (OPTIONAL)
     * @apiParam {string} userRight the Right of a user (Default END_USER) (OPTIONAL)
     * @apiParam {string} loginName a unique string with 4 <= length <= 64 (OPTIONAL)
     * @apiParam {string} firstName the firstname of a user, string with 3 <= length <= 256 (OPTIONAL)
     * @apiParam {string} lastName the lastname of a user, string with 3 <= length <= 256 (OPTIONAL)
     * @apiParam {string} email unique email (OPTIONAL)
     *
     * @apiExample Example usage:
     * curl -i  https://localhost:3001/v1/auth/users/2
     *
     * @apiSuccess {String} id the ID of updated user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2"
     *          },
     *          "result":"ok",
     *          "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.put('/v1/auth/users/:id', oUserCtrl.update);
    /**
     * @api {DELETE} /v1/auth/users/:id Delete One
     * @apiVersion 1.0.0
     * @apiName Delete
     * @apiGroup User
     * @apiPermission Admin and super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Admin can delete enduser and anonymous, super admin can delete every role
     *
     * @apiParam {String} id ID of user
     *
     * @apiExample Example usage:
     * curl -i  https://localhost:3001/v1/auth/users/2
     *
     * @apiSuccess {String} id Id of deleted user
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "2"
     *          },
     *          "result":"ok",
     *          "message":""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *    HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.delete('/v1/auth/users/:id', oUserCtrl.delete);

    /**
     * @api {GET} /v1/auth/statistics/user/overall Get number of user in the system
     * @apiVersion 1.0.0
     * @apiName Get Count User Data
     * @apiGroup User
     * @apiPermission super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get number of user in the system with the super admin role
     *
     * @apiParam {none} noneOfInput nothing input here
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books
     *
     * @apiSuccess {Number} the result of number user
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": {x},
     *       "message": ""
     *     }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "message": "invalid input"
     *     }
     */
    app.get('/v1/auth/statistics/user/overall', oUserCtrl.getCountData);

}