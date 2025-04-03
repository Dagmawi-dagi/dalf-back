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

// newsletters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'newsletter',
//     default:[]
// }]

const newsletter_sub = sequelize.define('newsletter_sub', schema, {
  tableName: 'newsletter_subs',
  timestamps: true,
});

// pre save middler ware to send confirm mail to new subscriber
// newsletter_sub_Schema.pre('save', async function(next){
//     const subscriber = this;
//     // --------------------------------------------------------------------------------//
//     try {
//         new Email().confirm_newsletter_sub({
//         email: subscriber.email,
//         name: subscriber.name,
//         frontEnd: `${process.env.FRONTENDURL}/newsletter-confirm/${subscriber._id}`,
//         createdAt: subscriber.createdAt,
//         })
//     } catch (error) { 
//         console.log(error);
//         next(new app_error_feedback(400, `confirmation email failed. plaese try again later', ${ JSON.stringify(error) }`)) 
//     }
// })

module.exports.model = newsletter_sub
module.exports.schema = schema