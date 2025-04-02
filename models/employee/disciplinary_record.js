const mongoose = require('mongoose');


const schema = {
  employee_archive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee_archive',
    required: true
  },
  date:{
    type: Date,
    required:true
  },
  title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true
  },
  decision:{
    type: String,
    required: true
  },
  decision_by:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const disciplinary_record_schema = new mongoose.Schema(schema,{timestamps:true})

module.exports.model = mongoose.model('disciplinary_record',disciplinary_record_schema)
module.exports.schema = schema
