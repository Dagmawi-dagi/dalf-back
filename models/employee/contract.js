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
  gross_salary :{
    type: Number,
    required: true
  },
  gross_salary_period:{
    type: String,
    enum: {
      values: ['daily', 'weekly','monthly','yearly'],
      message: '{VALUE} is not supported'
    },
    required: true,
  },
  comment: {
    type: String,
    required: true
  },
  status:{ 
    type: String,
    enum: {
      values: ['payed', 'pending'],
      message: '{VALUE} is not supported'
    },
    required: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }

}

const contract_Schema = new mongoose.Schema(schema,{ timestamps:true})
module.exports.model = mongoose.model('contract',contract_Schema)
module.exports.schema = schema