const mongoose = require('mongoose');

const schema = {
  title: {
    type: String,
    required: true,
    trim: true
  },
  content_short: {
    type: String,
    required: true,
  },
  content: { // quill string format of html content created by quill (vuequill)
    type: String,
    required: true,
    trim: true,
    validate: { // since vuequill will give us thosw value when passed as empty write custom validator to validat those 
      validator: function(v) {
        return  (v != "undefined" && v != "<p><br></p>");  
      },
      message: () => `blog's content is a required field`
    }
  },
  coverImg: {
    type: String,
    required: true,
  },
  category:[{
    type: String,
    required: true,
    enum:{
      values: ['info', 'news','social','event'],
      message: '{VALUE} is not supported'
    },
  }],
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }
}

const blog_Schema = new mongoose.Schema(schema,{ 
  timestamps:true,
  toJSON: {virtuals: true},
  toObject:{virtuals: true}
})


// Define a text index on multiple fields
// Before using $search, ensure the fields you want to search have a text index:
blog_Schema.index({ title: "text", content: "text",category: "text" }); 

// refer all the comments that point to this blog post as virtual docs
// since the array of ids may be alot 

blog_Schema.virtual('comments',{
  ref: 'blog_comment',
  foreignField: 'blog',
  localField: '_id'
});

module.exports.model = mongoose.model('blog',blog_Schema)
module.exports.schema = schema
