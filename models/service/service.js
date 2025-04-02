const mongoose = require('mongoose');


const schema = {
  name:{
    type: String,
    required: true
  },
  service_department:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service_department',
  },
  sub_service:[{
    type : mongoose.Schema.Types.ObjectId, 
    ref: 'service'  
  }],
  price: {
    type: Number,
    required: true, 
  },
  service_info:{
    // this will be service info object based on the department service create form
    type: Object,
    required: true
  },
  service_result_form_config:{
    type: String , // JSON.stringfy data intry inputs for result of this service
    required: true
  } ,
  type:{
    type: String,
    enum:{
      values: ['examination', 'procedure'],
      message: '{VALUE} is not supported'
    }
  },
  available:{
    type: Boolean,
    default: true,
  },
}

const service_Schema = new mongoose.Schema(schema,{timestamps:true})

module.exports.model = mongoose.model('service',service_Schema)
module.exports.schema = schema