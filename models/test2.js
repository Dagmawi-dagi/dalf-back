const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'departments',
  timestamps: true,
});

module.exports.model = Department;
module.exports.schema = Department.getAttributes()