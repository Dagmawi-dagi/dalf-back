const Joi = require('joi');
const mongoose = require('mongoose')

exports.generateJoiSchema  = (mongooseSchema,schemaName) => {
  const joiSchema = {};
  
  for (const key in mongooseSchema) {
    const field = mongooseSchema[key];
    const field_type = field.type
    let schema;

    // String Type        
    if( field_type === String ){
      schema = Joi.string();
      if (field.enum) {
        if( field.enum.message ) schema = schema.valid(...field.enum.values) // if  enum:{  values: ['requested', 'approved','rejected'],message: '{VALUE} is not supported' },
        else schema = schema.valid(...field.enum) // if enum: ['John', 'Jane', 'Doe']
      }
      if (field.match) schema = schema.pattern(field.match);
      if (field.minLength !== undefined) schema = schema.min(field.minLength);
      if (field.maxLength !== undefined) schema = schema.max(field.maxLength);
      if (field.trim === true) schema = schema.trim();
    }
    // Number
    else if( field_type === Number ){
      schema = Joi.number();
      if (field.enum) schema = schema.valid(...field.enum);
      if (field.min !== undefined) schema = schema.min(field.min);
      if (field.max !== undefined) schema = schema.max(field.max);
    }
    // Boolean
    else if( field_type === Boolean )  schema = Joi.boolean();
    // Date
    else if( field_type === Date ) schema = Joi.date();
    // object Id
    else if( field_type === mongoose.Schema.Types.ObjectId ) schema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
    // Array
    else if(  typeof field.type  === 'object'){
      console.log('true');
      if (field.type[0].name === 'String' ) schema = Joi.array().items( Joi.string() );
      if( field.type[0].name === 'Number' ) schema = Joi.array().items( Joi.number() );
      if( field.type[0].name === 'Date' ) schema = Joi.array().items( Joi.date() );
    } 
    //map
    else if( field.type === Map ) schema = Joi.object();
    else if( field.type === mongoose.Schema.Types.Mixed ) schema = Joi.any();
    // any
    else schema = Joi.any();
    
    // Handle custom validators
    if (field.validate) {
        const validator = field.validate.validator;
        const message = field.validate.message;
        schema = Joi.custom((value, helpers) => {
            if (validator(value)) return value;
            return helpers.message(message());
        });
    }

    // required | optional
    if (field.required) schema = schema.required(); 
    else schema = schema.optional();
    // Adding schemaName to the error message for all fields
    schema = schema.messages({
      'string.base': `${schemaName}'s ${key} should be a type of 'text'`,
      'string.empty': `${schemaName}'s ${key} cannot be empty`,
      'string.pattern.base': `${schemaName}'s ${key} does not match the required pattern`,
      'string.min': `${schemaName}'s ${key} should have a minimum length of {#limit}`,
      'string.max': `${schemaName}'s ${key} should have a maximum length of {#limit}`,
      'number.base': `${schemaName}'s ${key} should be a type of 'number'`,
      'number.min': `${schemaName}'s ${key} should have a minimum value of {#limit}`,
      'number.max': `${schemaName}'s ${key} should have a maximum value of {#limit}`,
      'boolean.base': `${schemaName}'s ${key} should be a type of 'boolean'`,
      'date.base': `${schemaName}'s ${key} should be a valid date`,
      'array.base': `${schemaName}'s ${key} should be an array`,
      'any.required': `${schemaName}'s ${key} is a required field`,
      'any.only': `${schemaName}'s ${key} must be one of the allowed values: {#valids}`,
      'any.custom': `${schemaName}'s ${key} failed custom validation`,
    });
    joiSchema[key] = schema;
  }

  // return joiSchema
    // include the schemaName inside the error message
  return Joi.object(joiSchema);
}

// Example  Schema Covering most Type & Validators
// const mongooseSchema = {
//   // String field with various validators
//   name: {
//       type: String,
//       required: true,
//       enum: ['John', 'Jane', 'Doe'], ||  enum:{  values: ['requested', 'approved','rejected'],message: '{VALUE} is not supported' },
//       match: /^[A-Z][a-z]+$/,
//       minLength: 3,
//       maxLength: 20,
//       trim: true,
//       default: 'John Doe',
//       validate: {
//           validator: function(v) {
//               return /^[A-Z][a-z]+$/.test(v);
//           },
//           message: () => `sth is not a valid user-name!`
//       }
//   },

//   // Number field with min and max validators
//   age: {
//       type: Number,
//       required: true,
//       min: 18,
//       max: 65,
//       default: 30
//   },

//   // Boolean field with a default value
//   isActive: {
//       type: Boolean,
//       default: true
//   },

//   // Date field with a default value
//   birthDate: {
//       type: Date,
//       default: Date.now
//   },

//   // ObjectId reference
//   userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true
//   },

//   // Array of Strings
//   hobbies: {
//       type: [String],
//       default: ['reading', 'travelling']
//   },

//   // Map of String fields
//   meta: {
//       type: Map,
//       of: String,
//       default: { key1: 'value1', key2: 'value2' }
//   },

//   // Mixed type field
//   additionalInfo: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {}
//   }
// };


// corresponding created joi schema will look like this below
// const joiSchema = Joi.object({
//   // Joi validation for String with multiple validators
//   name: Joi.string()
//       .valid('John', 'Jane', 'Doe')
//       .pattern(/^[A-Z][a-z]+$/)
//       .min(3)
//       .max(20)
//       .trim()
//       .default('John Doe')
//       .required()
//       .custom((value, helpers) => {
//           if (!/^[A-Z][a-z]+$/.test(value)) {
//               return helpers.message(`${value} is not a valid name!`);
//           }
//           return value;
//       }),

//   // Joi validation for Number with min and max validators
//   age: Joi.number()
//       .min(18)
//       .max(65)
//       .default(30)
//       .required(),

//   // Joi validation for Boolean with a default value
//   isActive: Joi.boolean()
//       .default(true)
//       .optional(),

//   // Joi validation for Date with a default value
//   birthDate: Joi.date()
//       .default(Date.now)
//       .optional(),

//   // Joi validation for ObjectId
//   userId: Joi.string()
//       .regex(/^[0-9a-fA-F]{24}$/)
//       .required(),

//   // Joi validation for Array of Strings
//   hobbies: Joi.array()
//       .items(Joi.string())
//       .default(['reading', 'travelling'])
//       .optional(),

//   // Joi validation for Map of Strings
//   meta: Joi.object()
//       .default({ key1: 'value1', key2: 'value2' })
//       .optional(),

//   // Joi validation for Mixed type (any)
//   additionalInfo: Joi.any()
//       .default({})
//       .optional()
// });
