const mongoose = require('mongoose');

const schema = {
  name:{
    type: String,
    required: true,
  },
  phone_number:{
    type: Number,
    required: true,
    unique: true
  },
  pateint_archive:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"pateint_archive",
    required: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const emergency_contact_Schema = new mongoose.Schema(schema,{timestamps:true})

module.exports.model = mongoose.model('emergency_contact',emergency_contact_Schema)
module.exports.schema = schema