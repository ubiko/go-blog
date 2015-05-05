var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    content: {
        type: String,
        required: true
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

module.exports = mongoose.model('Article', Article);