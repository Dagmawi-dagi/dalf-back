const mongoose = require('mongoose');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');
const schema = {
    // vacancy_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Vacancy',
    //     required: true
    // },
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uploaded_files: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          arrayOfStrings: true
        },
      },
    application_form: { type:  DataTypes.JSON, allowNull: false},
}

const vacancy_application = sequelize.define('vacancy_application', schema, {
    tableName: 'vacancy_applications',
    timestamps: true,
  });

module.exports.model = vacancy_application
module.exports.schema = schema