const Email = require('../../features/email') 
// const { model: newsletter_sub_model } = require('./newsletter_subs') 
const app_error_feedback = require('../../err_handling/app_error_feedback');
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db conection/db');

const schema = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  subject: { type:  DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.JSON, allowNull: false },
  createdBy:{ type:  DataTypes.INTEGER, allowNull: true }, // allowNull: true since midllere ware will be if Just pass let Joi validator
}

const newsletter = sequelize.define('Newsletter', schema, {
  tableName: 'newsletters',
  timestamps: true,
});


newsletter.associate = (models)=>{
  newsletter.belongsTo(models.user, { foreignKey: 'createdBy', targetKey: 'id' });

  // Recipients (many-to-many with newsletter_sub)
  newsletter.belongsToMany(models.newsletter_subs, {
    through: 'newsletter_recipients', // Junction table name
    as: 'recipients', // Alias for eager loading (when populating)
  });

  // Successful Recipients
  newsletter.belongsToMany(models.newsletter_subs, {
    through: 'newsletter_successful_recipients',
    as: 'successful_recipients',
  });

  // Failed Recipients
  newsletter.belongsToMany(models.newsletter_subs, {
    through: 'newsletter_failed_recipients',
    as: 'failed_recipients',
  });

}


newsletter.beforeCreate('', async function (model,options){

})

// pre save middler ware to send newsletter to subscribers
// newsletter_Schema.pre('save', async function(next){
//   // populate the array if ids in recipients field 
//   try {
//       // since the recipients field is [ids] populate them wil the doc they
//       await this.populate('recipients')
//       // before saving the newsletter to sent via email make sure it is send correctly and then saved it to DB
//       // for each newsletter subscriber
//       const newsletter = this;
//       const successfulRecipients = [];
//       const failedRecipients = [];
//       // --------------------------------------------------------------------------------//
//       const email_sending_errors = []
//       for (let i = 0; i < newsletter.recipients.length; i++) {
//         const recipient = newsletter.recipients[i];
//         if (!recipient.confirmed ) continue
//         // send the email inside trycatch block
//         try {
//           new Email().sendNewsletter({
//             subject: newsletter.subject,
//             email: recipient.email,
//             name: recipient.name,
//             frontEnd: process.env.FRONTENDURL,
//             UnsubscribeLink: `${process.env.FRONTENDURL}/newsletter-unsub/${recipient._id}`,
//             createdAt: newsletter.createdAt,
//             createdBy: newsletter.createdBy,
//             coverImg: newsletter.coverImg,
//             content: newsletter.content
//           })
//           successfulRecipients.push(recipient._id); // if the email sending for this email was succ push the recipient._id to successfulRecipients
//         } catch (error) { 
//           email_sending_errors.push(error) // log this at last if all the email sending was failed 
//           failedRecipients.push(recipient._id); // if the email sending for this email was err push the recipient._id to failedRecipients}
//         }
//       }
//       //----------------------------------------------------------------------------------------------------//
//       // if we have at least 1 sent email the newsletter must be saved 
//       if (email_sending_errors.length === 0 ) {
//         newsletter.successful_recipients = successfulRecipients;
//         newsletter.failed_recipients = failedRecipients;
//         // here the newsletter_sub has a field called newsletters[] to saved the ids of letters sent to them
//         for (let i = 0; i < newsletter.successful_recipients.length; i++) {
//           const successful_recipient_id = newsletter.successful_recipients[i];
//           await newsletter_sub_model.findByIdAndUpdate(successful_recipient_id,{$push:{newsletters: newsletter._id}},{new:true})
//         }
//         next();
//       } else {
//         // if all the email sending was failed newsletter is not sent so no need to save it to DB
//         // the global error handler will handle this
//         next(new app_error_feedback(400, ` All email deliveries failed. Newsletter will not be saved.', email_sending_errors: ${ JSON.stringify(email_sending_errors) }`)) 
//       }

//   }
//   catch (error) {
//     // the global error handler will handle this
//     // this error will be from the populate and the newsletter_sub_model.findByIdAndUpdate .... the other
//     next(error)
//   }
// })

module.exports.model = newsletter
module.exports.schema = schema