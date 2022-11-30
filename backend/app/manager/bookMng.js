/**
 * Created by bioz on 1/13/2017.
 */
// third party components
const Validator = require('validator');
const JsonWebToken = require('jsonwebtoken');

// our components
const Constant = require('../configs/constant');
const Book = require('../models/book');
const Pieces = require('../utils/pieces');
const Config = require('../configs/gConfig');
const User = require('../models/user');
const {USER_TYPE} = require("../configs/constant");
const BCrypt = require("bcryptjs");

exports.create = function (accessUserId, accessUserRight, accessUserName, data, callback) {
    try {

        console.log("book code",data.code);

        if ( !Validator.isAlphanumeric(data.code)) {
            return callback(2, 'invalid_book_code', 400, 'code is not a string', null);
        }

        if (!Pieces.VariableBaseTypeChecking(data.bookName, 'string')
            || !Validator.isLength(data.bookName, {min: 4, max: 128}) ) {
            return callback(2, 'invalid_book_name', 400, 'name is not alphanumeric and 4 - 128 characters', null);
        }



        if (!Pieces.VariableBaseTypeChecking(data.authorName, 'string')
            || !Validator.isLength(data.authorName, {min: 4, max: 128}) ) {
            return callback(2, 'invalid_author_name', 400, 'name is not alphanumeric and 4 - 128 characters', null);
        }

        if (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0 ) {
            return callback(8, 'invalid_right', 403, 'you must be admin to do this process', null);
        }

        if ( Pieces.VariableBaseTypeChecking(data.yearPublication,'int') ) {
            return callback(2, 'invalid_book_yearPublication', 400, 'year publication is not a int', null);
        }

        if ( Pieces.VariableBaseTypeChecking(data.quantity,'int') ) {
            return callback(2, 'invalid_book_quantity', 400, 'quantity of book is not a int', null);
        }

        let queryObj = {};

        queryObj.code = data.code;
        queryObj.creator = accessUserId;
        queryObj.updater = accessUserId;
        queryObj.bookName = data.bookName;
        queryObj.updatedBy = accessUserId;
        queryObj.createdBy = accessUserId;
        queryObj.authorName = data.authorName;
        queryObj.yearPublication = data.yearPublication;
        queryObj.quantity = data.quantity;



        if(data.category!=undefined){
            queryObj.category = data.category;
        }
        else {
            queryObj.category = Constant.CATEGORY[10];
        }

        if( !Pieces.VariableEnumChecking(queryObj.category, Constant.CATEGORY)){
            return callback(2, 'invalid_book_category', 400, 'category doesnt match in constant' );
        }

            Book.create(queryObj).then(book=>{
            "use strict";
            return callback(null, null, 200, null, book);
        }).catch(function(error){
            "use strict";
            return callback(2, 'create_book_fail', 400, error, null);
        });
    }catch(error){
        return callback(2, 'create_book_fail', 400, error, null);
    }
};

exports.delete = function (accessUserId, accessUserRight, bookId, callback) {
    try {
        if (!Pieces.VariableBaseTypeChecking(bookId,'string')
            || !Validator.isMongoId(bookId)) {
            return callback(8, 'invalid_id', 400, 'user id is not a mongo id string');
        }

        if(Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserRight) < 0){
            return callback(8, 'invalid_right', 403, null);
        }

        let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserRight);
        let lowerUserRightList=[];
        if(userRightIdx > 0){
            lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
        }

        let query = {_id: bookId, userRight: {$in: lowerUserRightList}};
        let update = {status: Constant.STATUS_ENUM[2]};
        let options = {upsert: false, new: false, setDefaultsOnInsert: true};

        Book.findOneAndUpdate(query, update, options, function (error, book) {
            book.status = update.status;
            console.log(book.status);
            if (error) {
                return callback(8, 'find_update_fail', 420, error);
            } else {
                if ( book && book.status === Constant.STATUS_ENUM[2] ){
                    console.log(book.status);
                    console.log(book);
                    book.remove(function(error) {
                        if(error){
                            return callback(8, 'remove_fail', 420, error);
                        }
                        return callback(null, null, 200, null);
                    });
                }else {
                    return callback(null, null, 200, null);
                }
            }
        });
    }catch(error){
        return callback(8, 'delete_fail', 400, error);
    }
};


exports.getOne = function (accessUserId, Id, callback) {
    try {
        if ( !( Pieces.VariableBaseTypeChecking(Id,'string'))
            && !Pieces.VariableBaseTypeChecking(Id,'number') ){
            return callback(2, 'invalid_book_id', 400, 'book id is incorrect', null);
        }

        let query = {};

        query._id = Id;
        console.log(query._id);
        let options = {'password': 0, 'resetPasswordToken': 0, 'updater': 0};

        Book.findOne(query, options, function (error, book) {
            if (error) {
                return callback(8, 'find_fail', 420, error, null);
            }

            if(!book){
                return callback(8, 'unavailable', 404, null, null);
            }else{
                return callback(null, null, 200, null, book);
            }
        });

    }catch(error){
        return callback(2, 'get_one_book_fail', 400, error, null);
    }
};

exports.getAll = function (accessUserId, accessUserType, accessUserName, queryContent, callback) {
    try {
        if ( (Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserType) < 0) ) {
            return callback(8, 'invalid_right', 400, null, null);
        }

        let condition = {};
        let userRightIdx = Constant.USER_RIGHT_ENUM.indexOf(accessUserType);
        let lowerUserRightList=[];
        if(userRightIdx > 0){
            lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
        }

        let statusWithoutDel = Constant.STATUS_ENUM.slice(0, Constant.STATUS_ENUM.length);
        statusWithoutDel.splice(2,1);

        condition.userRight = {$in: lowerUserRightList };

        this.parseFilter(accessUserId, accessUserType, condition, queryContent.filter);
        if( Pieces.VariableBaseTypeChecking(queryContent.q, 'string') ){
            condition['$text'] = {$search: queryContent.q};
        }

        let options = {};
        options.criteria = condition;
        options.keys = {'password': 0, 'resetPasswordToken': 0};

        Book.pagedFind(options, queryContent, function (error, results) {
            if (error) {
                return callback(8, 'finds_fail', 420, error, null);
            }
            return callback(null, null, 200, null, results);
        });
    }catch(error){
        return callback(8, 'gets_fail', 400, error, null);
    }
};

exports.parseFilter = function (accessUserId, accessUserRight, condition, filters) {
    try {
        if ( !Pieces.VariableBaseTypeChecking(filters,'string')
            || !Validator.isJSON(filters) ) {
            return false;
        }

        let aDataFilter = Pieces.safelyParseJSON1(filters);
        if( aDataFilter && (aDataFilter.length > 0) ){
            for(let i = 0; i < aDataFilter.length; i++ ){
                if ( !Pieces.VariableBaseTypeChecking(aDataFilter[i].key, 'string')
                    || !Pieces.VariableBaseTypeChecking(aDataFilter[i].operator, 'string')
                    || aDataFilter[i].value === null
                    || aDataFilter[i].value === undefined ){
                    continue;
                }

                if ( aDataFilter[i].key === 'isAlive'
                    && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=') )
                    && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'boolean') ) {
                    switch(aDataFilter[i].operator){
                        case '=':
                            condition[aDataFilter[i].key] = aDataFilter[i].value;
                            break;
                        case '!=':
                            condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                            break;
                    }
                    continue;
                }

                if ( aDataFilter[i].key === 'status'
                    && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=') )
                    && Pieces.VariableEnumChecking(aDataFilter[i].value, Constant.STATUS_ENUM) ) {
                    switch(aDataFilter[i].operator){
                        case '=':
                            condition[aDataFilter[i].key] = aDataFilter[i].value;
                            break;
                        case '!=':
                            condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                            break;
                    }
                    continue;
                }

                if ( aDataFilter[i].key === 'createdAt'
                    && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=')
                        || (aDataFilter[i].operator === '<') || (aDataFilter[i].operator === '>')
                        || (aDataFilter[i].operator === '<=') || (aDataFilter[i].operator === '>=')
                        || (aDataFilter[i].operator === 'in'))
                ) {
                    if( aDataFilter[i].operator !== 'in'
                        && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                        && Validator.isISO8601(aDataFilter[i].value) ){
                        switch(aDataFilter[i].operator){
                            case '=':
                                condition[aDataFilter[i].key] = {$eq: aDataFilter[i].value};
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                break;
                            case '>':
                                condition[aDataFilter[i].key] = {$gt: aDataFilter[i].value};
                                break;
                            case '>=':
                                condition[aDataFilter[i].key] = {$gte: aDataFilter[i].value};
                                break;
                            case '<':
                                condition[aDataFilter[i].key] = {$lt: aDataFilter[i].value};
                                break;
                            case '<=':
                                condition[aDataFilter[i].key] = {$lte: aDataFilter[i].value};
                                break;
                        }
                    }else if(aDataFilter[i].operator === 'in'){
                        if(aDataFilter[i].value.length === 2
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                            && Validator.isISO8601(aDataFilter[i].value[0])
                            && Validator.isISO8601(aDataFilter[i].value[1]) ){
                            condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                        }
                    }
                    continue;
                }

                if ( aDataFilter[i].key === 'updatedAt'
                    && ( (aDataFilter[i].operator === '=') || (aDataFilter[i].operator === '!=')
                        || (aDataFilter[i].operator === '<') || (aDataFilter[i].operator === '>')
                        || (aDataFilter[i].operator === '<=') || (aDataFilter[i].operator === '>=')
                        || (aDataFilter[i].operator === 'in') )
                ) {
                    if( aDataFilter[i].operator !== 'in'
                        && Pieces.VariableBaseTypeChecking(aDataFilter[i].value, 'string')
                        && Validator.isISO8601(aDataFilter[i].value) ){
                        switch(aDataFilter[i].operator){
                            case '=':
                                condition[aDataFilter[i].key] = {$eq: aDataFilter[i].value};
                                break;
                            case '!=':
                                condition[aDataFilter[i].key] = {$ne: aDataFilter[i].value};
                                break;
                            case '>':
                                condition[aDataFilter[i].key] = {$gt: aDataFilter[i].value};
                                break;
                            case '>=':
                                condition[aDataFilter[i].key] = {$gte: aDataFilter[i].value};
                                break;
                            case '<':
                                condition[aDataFilter[i].key] = {$lt: aDataFilter[i].value};
                                break;
                            case '<=':
                                condition[aDataFilter[i].key] = {$lte: aDataFilter[i].value};
                                break;
                        }
                    }else if(aDataFilter[i].operator === 'in'){
                        if(aDataFilter[i].value.length === 2
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[0], 'string')
                            && Pieces.VariableBaseTypeChecking(aDataFilter[i].value[1], 'string')
                            && Validator.isISO8601(aDataFilter[i].value[0])
                            && Validator.isISO8601(aDataFilter[i].value[1]) ){
                            condition[aDataFilter[i].key] = { $gte: aDataFilter[i].value[0], $lte: aDataFilter[i].value[1] };
                        }
                    }
                }
            }
        }else{
            return false;
        }
    }catch (error){
        return false;
    }
};

exports.update = function (accessUserId, accessUserType, bookId, bookData, callback) {
    try {
        let options = {
            upsert: false,
            new: true,
            setDefaultsOnInsert: true,
            projection: {password: false, socialNetwork: false}
        };

        if ( Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserType) < 0 ) {
            return callback(8, 'invalid_right', 403, null, null);
        }

        let query = {};
        let userRightIdx = Constant.USER_RIGHT_MANAGER_ENUM.indexOf(accessUserType);
        let lowerUserRightList=[];
        if( userRightIdx >= 0 ){
            lowerUserRightList = Constant.USER_RIGHT_ENUM.slice(0, userRightIdx);
        }

        let update = {};

        update.updatedBy=accessUserId;
        update.updatedAt= new Date();

        if (Pieces.VariableEnumChecking(update.status, Constant.BOOK_STATUS)) {
            update.status = update.status;
        }else{
            update.status = Constant.BOOK_STATUS[1];
        }

        if ( Pieces.VariableBaseTypeChecking(bookData.code, 'string')
            && Validator.isAlphanumeric(bookData.code)
            && Validator.isLowercase(bookData.code)
            && Validator.isLength(bookData.code, {min: 4, max: 64}) ) {
            update.code = bookData.code;
        }

        if ( Pieces.VariableBaseTypeChecking(bookData.bookName, 'string')
            && Validator.isAlphanumeric(bookData.bookName)
            && Validator.isLowercase(bookData.bookName)
            && Validator.isLength(bookData.bookName, {min: 4, max: 64}) ) {
            update.bookName = bookData.bookName;
        }

        if ( Pieces.VariableBaseTypeChecking(bookData.authorName, 'string')
            && Validator.isLength(bookData.authorName, {min: 4, max: 64}) ) {
            update.authorName = bookData.authorName;
        }

        if ( (Validator.isNumeric(bookData.yearPublication) && bookData.yearPublication>0)
            && Validator.isLength(bookData.yearPublication, {min: 1, max: 5})) {
            update.yearPublication = bookData.yearPublication;
        }
        else{
            update.yearPublication = -1;
        }

        if(Pieces.VariableEnumChecking(bookData.status, Constant.STATUS_ENUM)){
            update.status = bookData.status;
        }

        if(Pieces.VariableEnumChecking(bookData.userRight, Constant.USER_RIGHT_ENUM)){
            update.userRight = bookData.userRight;
        }


        Book.findOneAndUpdate(query, update, options, function (error, book) {
            if (error) {
                return callback(8, 'find_update_fail', 420, error, null);
            }
            if(book){
                return callback(null, null, 200, null, book);
            }else{
                return callback(8, 'unavailable', 400, null, null);
            }
        });

    }catch(error){
        return callback(2, 'update_device_fail', 400, error);
    }
};