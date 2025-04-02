const mongoose = require('mongoose');

const schema = {
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
    required: true
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required:true
  }
}
const employee_archive_Schema = new mongoose.Schema(schema,{
  timestamps:true,
  toJSON: {virtuals: true},
  toObject:{virtuals: true}
})


// refer all the Documents that point to this archive as virtual docs
// because the array of ids may be so many 

employee_archive_Schema.virtual('contracts',{
  ref: 'contract',
  foreignField: 'employee_archive',
  localField: '_id'
});

employee_archive_Schema.virtual('rest_leaves',{
  ref: 'rest_leave',
  foreignField: 'employee_archive',
  localField: '_id'
});

employee_archive_Schema.virtual('disciplinary_records',{
  ref: 'disciplinary_record',
  foreignField: 'employee_archive',
  localField: '_id'
});

employee_archive_Schema.virtual('work_schedule',{
  ref: 'work_schedule',
  foreignField: 'employee_archive',
  localField: '_id'
});

employee_archive_Schema.virtual('payed_contracts',{
  ref: 'payed_contract',
  foreignField: 'employee_archive',
  localField: '_id'
});

employee_archive_Schema.virtual('payed_shares',{
  ref: 'payed_share',
  foreignField: 'employee_archive',
  localField: '_id'
});


module.exports.model = mongoose.model('employee_archive',employee_archive_Schema)
module.exports.schema = schema