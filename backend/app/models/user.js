/**
 * Created by SugarTawng on 9/11/2022
 */
// third party components
const Mongoose = require('mongoose');

// our components
const Constant = require('../configs/constant');
const PagedFind = require('./plugins/pagedFind'); // cái này là cái gì v tời :===

let Schema = Mongoose.Schema;

// We have 2 default user in this system: sadmin:sadmin, anonymous:anonymous
let UserSchema = new Schema({
    loginName: {
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        minlength: 4,
        maxlength: 64,
        default: 'NONE'
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 64,
        required: true
    },
    language:{
        type: String,
        require: true,
        minlength: 2,
        maxlength:2,
        default: 'en'
    },
    firstName:{
        type: String,
        minlength: 3,
        maxlength: 256,
        required: true
    },

    lastName:{
        type: String,
        minlength: 3,
        maxlength: 256,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },
    userRight: {
        type: String,
        default: Constant.USER_RIGHT_ENUM[1],
        required: true,
        enum: Constant.USER_RIGHT_ENUM
    },
    system: {
        type: Boolean,
        default: false,
        required: true
    },

    status: {
        type: String,
        required: true,
        default:Constant.STATUS_ENUM[3],
        enum: Constant.STATUS_ENUM
    },
    isAlive: {
        type: Boolean,
        required: true,
        default:false
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
    }
});

UserSchema.index({username: 'text', displayName: 'text'});

UserSchema.virtual('id')
    .get(function(){ return this.get('_id');})
    .set(function(value){return this.set('_id',value);});

UserSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.__v;
    }
});

UserSchema.pre('save', function (next) {
    let currentDate = new Date();
    this.updatedAt = currentDate;

    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

UserSchema.plugin(PagedFind);

module.exports = Mongoose.model('user', UserSchema);
