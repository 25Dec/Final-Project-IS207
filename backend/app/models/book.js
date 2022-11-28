/**
 * Created by SugarTawng on 16/11/2022
 */
// third party components
const Mongoose = require('mongoose');

// our components
const Constant = require('../configs/constant');
const PagedFind = require('./plugins/pagedFind'); // cái này là cái gì v tời :===

let Schema = Mongoose.Schema;

let BookSchema = new Schema({
    code: {
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true,
        unique: true
    }
    ,
    bookName: {
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true
    },
    language:{
        type: String,
        require: true,
        default: 'en'
    },
    authorName:{
        type: String,
        minlength: 3,
        maxlength: 256,
    },
    yearPublication: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: {
        type: Number,
        minlength: 1,
        maxlength: 3,
        required: true
    },
    status: {
        type: String,
        required: true,
        default:Constant.BOOK_STATUS[1],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: String,
        require: true,
        default: Constant.DELETED[1]
    },
    category: {
        type: String,
        require: true
    }
});

BookSchema.index({bookName: 'text', authorName: 'text'});

BookSchema.virtual('id')
    .get(function(){ return this.get('_id');})
    .set(function(value){return this.set('_id',value);});

BookSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.__v;
    }
});

BookSchema.pre('save', function (next) {
    let currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});


BookSchema.plugin(PagedFind);

module.exports = Mongoose.model('book', BookSchema);
