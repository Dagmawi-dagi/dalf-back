const { DataTypes } = require('sequelize');
const { sequelize } = require('../db conection/db');

const schema = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
}

const test = sequelize.define('test', schema, {
  tableName: 'tests',
  timestamps: true,
});


module.exports.model = test;
module.exports.schema = schema