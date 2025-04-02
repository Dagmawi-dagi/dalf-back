const mongoose = require('mongoose');

const schema = {
  from_date:{
    type: Date,
    required: true
  },
  to_date:{
    type: Date,
    required: true
  },
  share_of_services_and_total_company_income_form:{
    // this form will contain all the share percents for all the services and other company incomes
    // this form will be filed by the HR department on employee registration 
    type: Object,
    required: true
  },
  employee:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee'
  },
  // requested services by the employee or user
  // use the prices of the request by the invoice issued_at_price
  service_requests:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service_request'
  }],
}

const payed_share_Schema = new mongoose.Schema(schema,{timestamps:true})

module.exports.model = mongoose.model('payed_share',payed_share_Schema)
module.exports.schema = schema