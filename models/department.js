const mongoose = require('mongoose');

// NOTE department === role

const schema = {
  department_name: {   
    type: String,
    required: true,
    unique: true
  },
  department_group:{  // if the department(role) belongs to group 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department_group',
    default:null
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const department_Schema = new mongoose.Schema(schema,{
  timestamps:true,
  toJSON:{virtuals: true},
  toObject: {virtuals:true}
})


module.exports.model = mongoose.model('department',department_Schema)
module.exports.schema = schema