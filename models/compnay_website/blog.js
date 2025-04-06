const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');
const { models_ref } = require('../../models/models_ref');


const schema = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type:  DataTypes.STRING, allowNull: false},
  content_short: { type:  DataTypes.STRING, allowNull: false},
  content: { type:  DataTypes.TEXT, allowNull: false},
  coverImg: { type:  DataTypes.STRING, allowNull: false},
  category:{
    type: DataTypes.JSON,
    allowNull: false,
    arrayOfStrings: true,
    allowed: ['info', 'news','social','event'],
    validate: {
      isArrayOfAllowedValues(value) {
        const allowed = ['info', 'news', 'social', 'event'];
        if (!Array.isArray(value)) throw new Error('Category must be an array of strings');
        for (const v of value) {
          if (!allowed.includes(v)) throw new Error(`Invalid value: ${v}`);
        }
      }
    },
  },
  createdBy:{ type:  DataTypes.INTEGER, allowNull: false},
}

const blog = sequelize.define('Blog', schema, {
  tableName: 'blogs',
  timestamps: true,
});

//---------- create our relationships--------------//

blog.associate = function (models){
  blog.belongsTo(models.user,  { foreignKey: 'createdBy', targetKey: 'id',});
}

module.exports.model = blog
module.exports.schema = schema