const mongoose = require('mongoose');

const schema = {
  service:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'service'
  },
  service_result: Object,  // this will be result object based on the service's Result_form_config
  // refer the invoice created for this service request w]h is the invoice created at that time the cus the invoice for services may change 
  invoice:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'invoice'
  },
  pateint_archive: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'pateint_archive'
  },
  updated: Boolean,  // service can be updated ny the one who requested the service
  cancelled: Boolean, // on cancel cancel the queue and the invoice for this service too
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  }
}

const service_request_Schema = new mongoose.Schema(schema,{timestamps:true})

module.exports.model = mongoose.model('service_request',service_request_Schema)
module.exports.schema = schema