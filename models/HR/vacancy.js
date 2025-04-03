const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');


const schema = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  position_name: { type:  DataTypes.STRING, allowNull: false},
  description: { type:  DataTypes.STRING, allowNull: false},
  requirements: { type:  DataTypes.STRING, allowNull: false},
  locations: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      arrayOfStrings: true
    },
  },
  salary: { type:  DataTypes.STRING, allowNull: false},
  company: { type:  DataTypes.STRING, allowNull: false},
  deadline: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
}


const vacancy = sequelize.define('vacancy', schema, {
  tableName: 'vacancies',
  timestamps: true,
});

// vacancy.belongsTo(User, { foreignKey: 'createdBy', targetKey: 'id' });

// vacancy_Schema.virtual('applications',{
//   ref: 'vacancy_application',
//   foreignField: 'vacancy',
//   localField: '_id'
// });

module.exports.model = vacancy
module.exports.schema = schema