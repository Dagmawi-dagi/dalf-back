const mongoose = require('mongoose');

const schema = {
  position_name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {  
    // this will hold quill editors html code 
    // this will make creating requirements become much more flexible
    type: String, 
    required: true,
    trim: true,
    validate: { // since vuequill will give us thosw value when passed as empty write custom validator to validat those 
      validator: function(v) {
        return  (v != "undefined" && v != "<p><br></p>");  
      },
      message: () => `vacancy's requirements is a required field`
    }
  },
  locations: [{
    type: String,
    required: true
  }],
  salary: {
    type: String,
    default: null
  },
  company: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}


const vacancy_Schema = new mongoose.Schema(schema,{ 
  timestamps:true,
  toJSON: {virtuals: true},
  toObject:{virtuals: true}
})

// refer all the vacancy applications that point to this vacancy post as virtual docs
// since the array of ids may be alot 

vacancy_Schema.virtual('applications',{
  ref: 'vacancy_application',
  foreignField: 'vacancy',
  localField: '_id'
});

module.exports.model = mongoose.model('vacancy',vacancy_Schema)
module.exports.schema = schema