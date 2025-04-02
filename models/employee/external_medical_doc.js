const mongoose = require('mongoose');

const schema = {
  pateint_archive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pateint_archive',
    required: true
  },
  scanned_docs : {
    type: [String],
    required: true
  },
  comment: {
    type:  String,
    required: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const external_medical_doc_Schema = new mongoose.Schema(schema,{
  timestamps:true,
})


module.exports.model = mongoose.model('external_medical_doc',external_medical_doc_Schema)
module.exports.schema = schema