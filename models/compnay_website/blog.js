const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');

const schema = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type:  DataTypes.STRING, allowNull: false},
  content_short: { type:  DataTypes.STRING, allowNull: false},
  content: { type:  DataTypes.STRING, allowNull: false},
  coverImg: { type:  DataTypes.STRING, allowNull: false},
  category:{
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isIn: [['info', 'news','social','event']],
      arrayOfStrings: true
    },
  },
  createdBy:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  }
}

const blog = sequelize.define('Blog', schema, {
  tableName: 'blogs',
  timestamps: true,
});

blog.belongsTo(User, { foreignKey: 'createdBy', targetKey: 'id' });

module.exports.model = blog
module.exports.schema = schema
