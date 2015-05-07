var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var URLSlugs = require('mongoose-url-slugs');

var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    content: {
        type: String,
        required: true
    },

    slug: {
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

// Save slugs to 'slug' field.
ArticleSchema.plugin(URLSlugs('title', { field: 'slug', update: true }));

module.exports = mongoose.model('Article', ArticleSchema);