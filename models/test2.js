const { DataTypes } = require('sequelize');
const { sequelize } = require('../db conection/db');

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'departments',
  timestamps: true,
  indexes: [
    {
      type: "FULLTEXT",
      fields: ['name'] // Add fields you want to search on
    }
  ]
});

module.exports.model = Department;
module.exports.schema = Department.getAttributes()