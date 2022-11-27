/*
 * Created by s3lab. on 1/13/2017.
 */
// our components
const BookCtrl = require('../controllers/bookCtrl');

module.exports = function (app) {
    /**
     * @api {POST} /v1/auth/books Create a book
     * @apiVersion 1.0.0
     * @apiName Create_book
     * @apiGroup book
     * @apiPermission Every of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create a book by every one
     *
     * @apiParam {string}  a unique id int with 6 <= length <= 64
     * @apiParam {string} a unique code string with length <= 64
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books
     *
     * @apiSuccess {String} id the book is the data of book
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *     "data": {},
     *     "message": "",
     *     "result": "ok"
     *      }
     *
     * @apiError invalid input data
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "message": "",
     *     }
     */
    app.post('/v1/auth/books', BookCtrl.create);
    /**
     * @api {GET} /v1/auth/books/:id Get_A_book
     * @apiVersion 1.0.0
     * @apiName get_a_book
     * @apiGroup book
     * @apiPermission Every type of user
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get a book
     *
     * @apiParam {string} id of the book, on params
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books/3
     *
     * @apiSuccess {Int} id the ID of a book
     * @apiSuccess {Char} code login name of a book
     * @apiSuccess {String} name display name of a book
     * @apiSuccess {String} desc description of book
     * @apiSuccess {Bool} isAlive describe state of a book
     * @apiSuccess {Int} createdBy display people who created the book
     * @apiSuccess {Int} updatedBy display people who updated the book
     * @apiSuccess {Date} createdAt display the day when it was created
     * @apiSuccess {Date} updatedAt display the day when it was updated
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data":{
     *              "id": "3",
     *              "code": "dv002",
     *              "name": "router",
     *              "desc": "null",
     *              ...
     *          },
     *          "result": "ok",
     *          "message" ""
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
    app.get('/v1/auth/books/:id', BookCtrl.getOne);
    /**
     * @api {GET} /v1/auth/books Get List Of books
     * @apiVersion 1.0.0
     * @apiName getAll
     * @apiGroup book
     * @apiPermission Moderator, administrator, super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all books
     *
     * @apiParam {Number} page Page which we want to get (N/A)
     * @apiParam {Number} perPage Item per page (N/A)
     * @apiParam {String} sort Sort the list by a field (N/A)
     * @apiParam {String} filter filter the query data (N/A)
     * @apiParam {String} q Text filter for data (N/A)
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books
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
     *       "items": {"begin": 1, "end": 3, "total": 5},
     *       "pages": {"current": 1, "prev": 3, "hasPrev": true, "next": 5, "hasNext": true, "total": 56},
     *       "result": "ok",
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
    app.get('/v1/auth/books/', BookCtrl.getAll);
    /**
     * @api {PUT} /v1/auth/books/:id Update a book
     * @apiVersion 1.0.0
     * @apiName update
     * @apiGroup book
     * @apiPermission Moderator, Administrator, Super Admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update a book information
     *
     * @apiParam {String} id ID of a book, on params
     * @apiParam {char(5)} code Code of a book
     * @apiParam {String} name Name of a book
     * @apiParam {String} desc Description of a book
     * @apiParam {Bool} isAlive that is status of a book
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books/5
     *
     * @apiSuccess {String} id the ID of updated a book
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
     *       "result":"fail",
     *       "message": "invalid input"
     *     }
     */
    app.put('/v1/auth/books/:id', BookCtrl.update);
    /**
     * @api {DELETE} /v1/auth/books/:id Delete a Book
     * @apiVersion 1.0.0
     * @apiName delete
     * @apiGroup Book
     * @apiPermission Moderator, Administrator, Super Admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete a Book
     *
     * @apiParam {String} id ID of a Book
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books/3
     *
     * @apiSuccess {String} id Id of a deleted book
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
     *       "result":"fail",
     *       "message": "invalid input"
     *     }
     */
    app.delete('/v1/auth/books/:id', BookCtrl.delete);
};
