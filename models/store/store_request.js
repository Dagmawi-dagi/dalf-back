const mongoose = require('mongoose');

const schema = {
  store_item:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store_item',
    required: true
  },
  aprroved_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  status:{
    type: String,
    enum:{
      values: ['requested', 'approved','rejected'],
      message: '{VALUE} is not supported'
    },
    required: true
  },
  comment: {
    type:String,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const store_request_Schema = new mongoose.Schema(schema,{
  timestamps: true,
})

module.exports.model = mongoose.model('store_request',store_request_Schema)
module.exports.schema = schema