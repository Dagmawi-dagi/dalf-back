const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const schema = {
  item_name : {
    type: String,
    required: true,
  },
  item_type:{
    type: String,
    required: true,
  },
  quantity:{
    type: Number,
    required: true,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const store_item_Schema = new mongoose.Schema(schema,{ timestamps: true})

module.exports.model = mongoose.model('store_item',store_item_Schema)
module.exports.schema = schema