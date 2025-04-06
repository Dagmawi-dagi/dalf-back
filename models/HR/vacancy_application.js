const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');
const schema = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uploaded_files:{
      type: DataTypes.JSON,
      allowNull: false,
      arrayOfStrings: true,
      validate: {
        isArrayOfStrings(value) {
          if (!Array.isArray(value)) throw new Error('uploaded_files must be an array of strings');
        }
      },
    },
    application_form: { type:  DataTypes.TEXT, allowNull: false},
}

const vacancy_application = sequelize.define('vacancy_application', schema, {
    tableName: 'vacancy_applications',
    timestamps: true,
});

vacancy_application.associate = function (models){
  vacancy_application.belongsTo(models.vacancy);
}

module.exports.model = vacancy_application
module.exports.schema = schema