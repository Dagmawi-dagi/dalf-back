const mongoose = require('mongoose');

const standalone_schema = new mongoose.Schema({ // if the service department is one stand alone service 
  price: Number,
  result_form_config:String // JSON.stringfy
})

const schema = {
  name:{
    type: String,
    required: true
  },
  create_form_config:{ // service create form on this service department 
    type: String, // JSON.stringfy()
  },
  type:{
    type: String,
    enum:{
      values: ['examination', 'procedure'],
      message: '{VALUE} is not supported'
    }
  },
  invoiceable: {
    type: Boolean,
    required: true
  },
  standalone:standalone_schema,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service_department',
  }
}

const service_department_Schema = new mongoose.Schema(schema,{
  timestamps:true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// virtual refernce to all the services under this deartment
service_department_Schema.virtual('department_services',{
  ref: 'service',
  foreignField: 'service_department',
  localField: '_id'
})

module.exports.model = mongoose.model('service_department',service_department_Schema)
module.exports.schema = schema