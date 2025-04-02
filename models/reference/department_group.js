const mongoose = require('mongoose');

// NOTE department === role
// we will use this to group different departments(roles)

const schema = {
  department_group_name:{ 
    type: String,
    required: true,
    unique: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}

const department_group_Schema = new mongoose.Schema(schema,{
  timestamps:true,
  toJSON:{virtuals: true},
  toObject: {virtuals:true}
})


// refer all the departments that point to this group as virtual docs
// because to include it in this schema the array of ids may be so many 

department_group_Schema.virtual('departments',{
    ref: 'department',
    foreignField: 'department_group',
    localField: '_id'
});


module.exports.model = mongoose.model('department_group',department_group_Schema)
module.exports.schema = schema