const Joi = require('joi');
/**
 * Generate Joi schema based on a Sequelize model definition.
 * @param {Object} sequelizeModel - The Sequelize model definition (model.rawAttributes)
 * @param {String} schemaName - Name of the schema for error messages
 * @returns {Object} Joi validation schema
 */

exports.generateJoiSchema = (sequelizeModel, schemaName) => {
  const joiSchema = {};

  for (const key in sequelizeModel) {
    const field = sequelizeModel[key];
    let schema;

    // Handle String fields with regex and length validation
     if (field.type.constructor.name === 'STRING') {
      schema = Joi.string().trim();
      if (field.validate) {
        if (field.validate.len) {
          const [min, max] = field.validate.len;
          if (min !== undefined) schema = schema.min(min);
          if (max !== undefined) schema = schema.max(max);
        }
        if (field.validate.is)  schema = schema.pattern(new RegExp(field.validate.is));
        if (field.validate.isIn) schema = schema.valid(...field.validate.isIn[0]); // isIn enum
        if (field.validate.isEmail) schema = schema.email()
      }
    }

    // Handle Number fields
    else if (field.type.constructor.name === 'INTEGER' || field.type.constructor.name === 'FLOAT') {
      schema = Joi.number();
      if (field.validate) {
        if (field.validate.min !== undefined) schema = schema.min(field.validate.min);
        if (field.validate.max !== undefined) schema = schema.max(field.validate.max);
      }
    }

    // Handle Boolean fields
    else if (field.type.constructor.name === 'BOOLEAN') {
      schema = Joi.boolean();
    }

    // Handle Date fields
    else if (field.type.constructor.name === 'DATE') {
      schema = Joi.date();
    }

    // Handle Arrays of value using the equelize model definition meta data
    else if (field.type === DataTypes.JSON) { 
        if (field.arrayOfStrings === true) {
            schema = Joi.array().items(Joi.string()); // Validate as an array of strings
        }
        schema = Joi.array();
    }

    // Handle Foreign Keys
    else if (field.references) {
      schema = Joi.number().integer();
    }
    // Default case for unsupported types
    else {
      schema = Joi.any();
    }

    // ✅ Handle Custom Validators
    if (field.validate) {
      Object.entries(field.validate).forEach(([validatorName, validatorFn]) => {
        if (typeof validatorFn === 'function') {
          schema = schema.custom((value, helpers) => {
            try {
              validatorFn(value); // Run Sequelize custom validator
              return value;
            } catch (error) {
              return helpers.error('any.custom', { message: error.message });
            }
          });
        }
      });
    }

    // Adding custom validation messages
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
      'any.custom': `{#message}`
    });

    joiSchema[key] = schema;
  }

  return Joi.object(joiSchema);
};


// const { error } = generateJoiSchema(User.rawAttributes, 'User');

// Example  Schema Covering most Type & Validators

// const User = sequelize.define('User', {
//     // String field with various validators
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         isIn: [['John', 'Jane', 'Doe']], // Enum equivalent
//         is: /^[A-Z][a-z]+$/, // Regex validation
//         len: [3, 20], // Min & Max length
//         notEmpty: true, // Ensures it’s not empty
//       },
//       defaultValue: 'John Doe',
//  Adding metadata or extra properties
//       description: "sdasdsad",
//       isEditable: true,
//     },
  
//     // Number field with min and max validators
//     age: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         min: 18,
//         max: 65,
//       },
//       defaultValue: 30,
//     },
  
//     // Boolean field with a default value
//     isActive: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
  
//     // Date field with a default value
//     birthDate: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     //since my sql doesn't have array or object as sving to db option we need .. and pass metadata for flexiblity on any whare
//     hobbies: {
//       type: DataTypes.JSON, // No direct "Array" or "Object"
//       defaultValue: ['reading', 'travelling'],
//       defaultValue: {},
//       metadata_for_touse_for_somecase: value
//     },
//   }


// corresponding created joi schema will look like this below
// const joiSchema = Joi.object({
//     // Joi validation for String with multiple validators
//     name: Joi.string()
//       .valid('John', 'Jane', 'Doe')
//       .pattern(/^[A-Z][a-z]+$/)
//       .min(3)
//       .max(20)
//       .trim()
//       .default('John Doe')
//       .required(),
  
//     // Joi validation for Number with min and max validators
//     age: Joi.number()
//       .min(18)
//       .max(65)
//       .default(30)
//       .required(),
  
//     // Joi validation for Boolean with a default value
//     isActive: Joi.boolean()
//       .default(true)
//       .optional(),
  
//     // Joi validation for Date with a default value
//     birthDate: Joi.date()
//       .default(Date.now)
//       .optional(),
  
//     // Joi validation for Array of Strings (Stored as JSON in Sequelize)
//     hobbies: Joi.array()
//       .items(Joi.string())
//       .default(['reading', 'travelling'])
//       .optional(),s