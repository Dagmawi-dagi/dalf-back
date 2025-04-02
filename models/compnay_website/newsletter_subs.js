const mongoose = require('mongoose');
const app_error_feedback = require('../../err_handling/app_error_feedback');
const Email = require('../../features/email') 

const schema = {
    name:  {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    unsubscribe: {
        type: Boolean,
        default: false
    },
    newsletters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'newsletter',
        default:[]
    }]
}

const newsletter_sub_Schema = new mongoose.Schema(schema,{ timestamps:true })


// pre save middler ware to send confirm mail to new subscriber
newsletter_sub_Schema.pre('save', async function(next){
    const subscriber = this;
    // --------------------------------------------------------------------------------//
    try {
        new Email().confirm_newsletter_sub({
        email: subscriber.email,
        name: subscriber.name,
        frontEnd: `${process.env.FRONTENDURL}/newsletter-confirm/${subscriber._id}`,
        createdAt: subscriber.createdAt,
        })
    } catch (error) { 
        console.log(error);
        next(new app_error_feedback(400, `confirmation email failed. plaese try again later', ${ JSON.stringify(error) }`)) 
    }
})

module.exports.model = mongoose.model('newsletter_sub',newsletter_sub_Schema)
module.exports.schema = schema