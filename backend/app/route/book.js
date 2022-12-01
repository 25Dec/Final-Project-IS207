/*
 * Created by SugarTawng. on 1/13/2017.
 */
// our components
const BookCtrl = require('../controllers/bookCtrl');
const oUserCtrl = require("../controllers/userCtrl");

module.exports = function (app) {
    /**
     * @api {POST} /v1/auth/books Create a book
     * @apiVersion 1.0.0
     * @apiName Create book
     * @apiGroup Book
     * @apiPermission Anonymous, admin, super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Create a book by anonymous, super admin
     *
     * @apiParam {string}  code unique code string with 4 <= length <= 64
     * @apiParam {string}  bookName name of the book with 4 <= length <= 64
     * @apiParam {string}  language language of the book (optional)
     * @apiParam {string}  authorName author name of the book (optional)
     * @apiParam {number}  yearPublication the year when book public (default = 0)
     * @apiParam {number}  quantity the number of book
     * @apiParam {string}  status the status of that book (old or new or deleted, default new)
     * @apiParam {object}  createdBy the people who create that book (default that user id)
     * @apiParam {object}  updatedBy the people who update that book (default that user id)
     * @apiParam {date}  createdAt time when book was created (default at that time)
     * @apiParam {date}  updatedAt time when book was updated (default at that time)
     * @apiParam {string} deleted the status life of that book (yes or no, default no)
     * @apiParam {string}  category the type of that book
     * @apiParam {number}  rating the quality of the book that user rate
     *
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
     * @api {GET} /v1/auth/books/:id Get a book
     * @apiVersion 1.0.0
     * @apiName Get a book
     * @apiGroup Book
     * @apiPermission Every type of user not include guess
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get a book in the database
     *
     * @apiParam {string} id of the book, on params
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books/3
     *
     * @apiSuccess {_id} id the ID of a book
     * @apiSuccess {string} code the unique code of a book in database
     * @apiSuccess {string} bookName display name of a book
     * @apiSuccess {string} language the language of that book
     * @apiSuccess {string}  authorName author name of the book (optional)
     * @apiSuccess {number}  yearPublication the year when book public (default = 0)
     * @apiSuccess {number}  quantity the number of book
     * @apiSuccess {string}  status the status of that book (old or new or deleted, default new)
     * @apiSuccess {object}  createdBy the people who create that book (default that user id)
     * @apiSuccess {object}  updatedBy the people who update that book (default that user id)
     * @apiSuccess {date}  createdAt time when book was created (default at that time)
     * @apiSuccess {date}  updatedAt time when book was updated (default at that time)
     * @apiSuccess {string}  deleted the status life of that book (yes or no, default no)
     * @apiSuccess {string}  category the type of that book
     * @apiSuccess {number}  rating the quality of the book that user rate
     * @apiSuccess {id} id the repeated ID of a book
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
     *    {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.get('/v1/auth/books/:id', BookCtrl.getOne);
    /**
     * @api {GET} /v1/auth/books Get list of books
     * @apiVersion 1.0.0
     * @apiName Get All
     * @apiGroup Book
     * @apiPermission Every type of user not include guess
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get all books
     *
     * @apiParam {none} noneOfInput nothing input here
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books
     *
     * @apiSuccess {Object[]} data the list of object book data
     * @apiSuccess {Object} pages {current, prev, hasPrev, next, hasNext, total}
     * @apiSuccess {Object} items {begin, end, total}
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
     *    HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.get('/v1/auth/books/', BookCtrl.getAll);
    /**
     * @api {PUT} /v1/auth/books/:id Update a book
     * @apiVersion 1.0.0
     * @apiName Update
     * @apiGroup Book
     * @apiPermission  Admin, super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Update a book information, you can update all field if you want
     *
     * @apiParam {string}  code unique code string with 4 <= length <= 64 (IT MUST UNIQUE, OPTIONAL)
     * @apiParam {string}  bookName name of the book with 4 <= length <= 64 (OPTIONAL)
     * @apiParam {string}  language language of the book (optional) (OPTIONAL)
     * @apiParam {string}  authorName author name of the book (optional) (OPTIONAL)
     * @apiParam {number}  yearPublication the year when book public (default = 0) (OPTIONAL)
     * @apiParam {number}  quantity the number of book (OPTIONAL)
     * @apiParam {string}  status the status of that book (old or new or deleted, default new) (OPTIONAL)
     * @apiParam {object}  createdBy the people who create that book (default that user id) (OPTIONAL)
     * @apiParam {object}  updatedBy the people who update that book (default that user id) (OPTIONAL)
     * @apiParam {date}  createdAt time when book was created (default at that time) (OPTIONAL)
     * @apiParam {date}  updatedAt time when book was updated (default at that time) (OPTIONAL)
     * @apiParam {string} deleted the status life of that book (yes or no, default no) (OPTIONAL)
     * @apiParam {string}  category the type of that book (OPTIONAL)
     * @apiParam {number}  rating the quality of the book that user rate (OPTIONAL)
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
     *   HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.put('/v1/auth/books/:id', BookCtrl.update);
    /**
     * @api {DELETE} /v1/auth/books/:id Delete a Book
     * @apiVersion 1.0.0
     * @apiName Delete
     * @apiGroup Book
     * @apiPermission  Admin, super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription delete a Book
     *
     * @apiParam {String} id ID of a removed book
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
     *  HTTP/1.1 400 Bad Request
     *     {
     *       "result": "fail",
     *       "code": "x",
     *       "message": "invalid input",
     *       "description": "describe error"
     *     }
     */
    app.delete('/v1/auth/books/:id', BookCtrl.delete);

    /**
     * @api {GET} /v1/auth/statistics/book/overall Get number of title (đầu sách)
     * @apiVersion 1.0.0
     * @apiName Get Count Data
     * @apiGroup Book
     * @apiPermission Super admin
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get number of title data
     *
     * @apiParam {none} noneOfInput nothing input here
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books
     *
     * @apiSuccess {Number} the result of the title
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [...],
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

    app.get('/v1/auth/statistics/book/overall', BookCtrl.getCountData);

    /**
     * @api {GET} /v1/auth/topQuantity Get top quantity of every book
     * @apiVersion 1.0.0
     * @apiName Get Top Quantity
     * @apiGroup Book
     * @apiPermission Everybody not include guess
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription Get the number of all the books from big amount to small amount
     * @apiParam {none} noneOfInput nothing input here
     *
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books
     *
     * @apiSuccess {Object[]} data the list of data
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [...],
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

    app.get('/v1/auth/topQuantity', BookCtrl.getTopQuantity);

    /**
     * @api {GET} /v1/auth/topRating Get top rating of five book
     * @apiVersion 1.0.0
     * @apiName Get Top Rating
     * @apiGroup Book
     * @apiPermission Everybody not include guess
     * @apiHeader {String} access_token json web token to access to data
     *
     * @apiDescription List orderly rating of 5 descending book
     * @apiParam {none} noneOfInput nothing input here
     *
     * @apiExample Example usage:
     * curl -i https://conntomysql.herokuapp.com/v1/auth/books
     *
     * @apiSuccess {Object[]} data the list of data
     * @apiSuccess {String} result ok or fail
     * @apiSuccess {String} message something from server
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "data": [...],
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

    app.get('/v1/auth/topRating', BookCtrl.getTopRating);
};
