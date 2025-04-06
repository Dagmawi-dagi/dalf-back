const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');


const schema = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  position_name: { type:  DataTypes.STRING, allowNull: false},
  description: { type:  DataTypes.STRING, allowNull: false},
  requirements: { type:  DataTypes.TEXT, allowNull: false},
  locations:{
    type: DataTypes.JSON,
    allowNull: false,
    arrayOfStrings: true,
    validate: {
      isArrayOfStrings(value) {
        if (!Array.isArray(value)) throw new Error('locations must be an array of strings');
      }
    },
  },
  salary: { type:  DataTypes.STRING, allowNull: false},
  company: { type:  DataTypes.STRING, allowNull: false},
  deadline: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },

  createdBy:{ type:  DataTypes.INTEGER, allowNull: false},
}


const vacancy = sequelize.define('vacancy', schema, {
  tableName: 'vacancies',
  timestamps: true,
});

vacancy.associate = function (models){
  vacancy.belongsTo(models.user,  { foreignKey: 'createdBy', targetKey: 'id',});
  vacancy.hasMany(models.vacancy_application);
}

module.exports.model = vacancy
module.exports.schema = schema