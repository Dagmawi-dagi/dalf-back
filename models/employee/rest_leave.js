const mongoose = require('mongoose');

const schema = {
  employee_archive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee_archive',
    required: true
  },
  begin_date:{
    type: Date,
    required: true
  },
  end_date:{
    type: Date,
    required: true
  },
  duration:{
    type: Date,
    required: true
  },
  request_date:{
    type: Date,
    required: true
  },
  authorization_date:{
    type: Date,
    required: true
  },
  authorization_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  comment: {
    type: String,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}
const rest_leave_Schema = new mongoose.Schema(schema,{
  timestamps:true,
})

module.exports.model = mongoose.model('rest_leave',rest_leave_Schema)
module.exports.schema = schema
