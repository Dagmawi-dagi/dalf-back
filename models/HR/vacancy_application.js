const mongoose = require('mongoose');

const schema = {
    vacancy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
        required: true
    },
    uploaded_files: [{
        type: String,
        required: true
    }],
    application_form: {
        type: String, // Stringifed Object
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}


const vacancy_application_Schema = new mongoose.Schema(schema,{timestamps:true})

module.exports.model = mongoose.model('vacancy_application',vacancy_application_Schema)
module.exports.schema = schema