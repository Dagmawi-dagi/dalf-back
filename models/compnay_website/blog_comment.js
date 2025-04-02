const mongoose = require('mongoose');

const schema = {
    blog:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required:true
    },
    comment:{
        type: String,
        ref: 'user',
        required:true
    },
    reactions: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        native: {
            type: String,
            required: true,
        },
        count: {
            type: Number,
            default: 1
        }
    }],
}

const blog_comment_Schema = new mongoose.Schema(schema,{ timestamps:true })

module.exports.model = mongoose.model('blog_comment',blog_comment_Schema)
module.exports.schema = schema