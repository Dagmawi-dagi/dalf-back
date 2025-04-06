const app_error_feedback = require('../../err_handling/app_error_feedback');
const Email = require('../../features/email') 
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');

const schema = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type:  DataTypes.STRING, allowNull: false },
    email:{ type: DataTypes.STRING, allowNull: false, unique: true ,
        validate: {
            isEmail: true, 
        }
    },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
    unsubscribe: { type: DataTypes.BOOLEAN, defaultValue: false },
}

const newsletter_sub = sequelize.define('newsletter_sub', schema, {
  tableName: 'newsletter_subs',
  timestamps: true,
});

newsletter_sub.associate = (models)=>{
    newsletter_sub.belongsToMany(models.news_letter, {
      through: 'newsletter_successful_recipients', // Junction table name
      as: 'recieved_newsletters', // Alias for eager loading (when populating)
    });
}

newsletter_sub.beforeFind('',function(options){
    options.include = options.include || [];
    options.include.push({
      association: 'recieved_newsletters', // Use the alias defined in your association
      through: { attributes: [] }, // Exclude junction table fields
    });
})

newsletter_sub.afterCreate('', async function(model,options){
    const subscriber = model;
    // --------------------------------------------------------------------------------//
    try {
       await new Email().confirm_newsletter_sub({
        email: subscriber.email,
        name: subscriber.name,
        frontEnd: `${process.env.FRONTENDURL}/newsletter-confirm/${subscriber.id}`,
        createdAt: subscriber.createdAt,
        })
    } catch (error) { 
        model.destroy({force:true})
        throw new app_error_feedback(400, `confirmation email failed. plaese try again later', ${ JSON.stringify(error) }`)
    }
})

module.exports.model = newsletter_sub
module.exports.schema = schema