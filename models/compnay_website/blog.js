const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');

const schema = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type:  DataTypes.STRING, allowNull: false,canBeusedForSearchIndex:true},
  content_short: { type:  DataTypes.STRING, allowNull: false,canBeusedForSearchIndex:true},
  content: { type:  DataTypes.TEXT, allowNull: false,canBeusedForSearchIndex:true},
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
  createdBy:{ type:  DataTypes.INTEGER, allowNull: true}, // to pass the joi validation
}

const blog = sequelize.define('Blog', schema, {
  tableName: 'blogs',
  timestamps: true,
  indexes: [
    {
      type: "FULLTEXT",
      fields: ['title','content_short','content'] // Add fields you want to search on
    }
  ]
});

//---------- create our relationships--------------//

blog.associate = function (models){
  blog.belongsTo(models.user,  { foreignKey: 'createdBy', targetKey: 'id',});
}

module.exports.model = blog
module.exports.schema = schema