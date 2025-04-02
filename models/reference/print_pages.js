const mongoose = require('mongoose');

const schema = {
  name: {   
    type: String,
    required: true,
  },
  print_config: String, //JSON.stringify(),
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  }
}

const print_page_Schema = new mongoose.Schema(schema,{timestamps:true})

module.exports.model = mongoose.model('print_page',print_page_Schema)
module.exports.schema = schema