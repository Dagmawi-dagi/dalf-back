const mongoose = require('mongoose');

const schema = {
  // personal info
  first_name: {
    type: String,
    required: true
  },
  middle_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  gender:{
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not supported'
    },
    required: true,
  },
  // address
  email:{
    type: String,
    required: true,
    unique: true 
  },
  phone_number:{
    type: Number,
    required: true,
  },
  // // skill for
  // skill:{
  //   type: Object,
  //   default: null
  // },
  system_user:{
    type: Boolean,
    default: false,
  },
  has_share:{
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum:{
      values: ['active', 'inactive'],
      message: '{VALUE} is not supported'
    },
    default: 'inactive'
  },
  department: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department'
  }],
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const employee_Schema = new mongoose.Schema(schema,{timestamps:true})

// virtuals
employee_Schema.virtual('employee_archive',{
  ref: 'employee_archive',
  foreignField: 'employee',
  localField: '_id',
  justOne: true,
})

module.exports.model = mongoose.model('employee',employee_Schema)
module.exports.schema = schema