const mongoose  = require('mongoose');
const { models_ref } = require('../models/models_ref')
const catchAsync = require('../features/catchAsync');
const app_error_feedback = require('../err_handling/app_error_feedback');
const WEBSOCKET = require('../socket/socket')
const { common_controller } = require('../controllers/common_controllers');
const { my_schema } = require('../models/test');
const {generateJoiSchema} = require('../features/joi_validator')

exports.test = catchAsync(async(req,res,next)=>{

  //  use this below for trasaction operations
  // Key Points to Remember:
  // Session: A session is needed to group operations and manage transactions in Mongoose. It’s created using mongoose.startSession().
  // Transaction: A transaction is a group of operations that either all succeed or all fail. It is started with session.startTransaction() and should be either committed with session.commitTransaction() or aborted with session.abortTransaction().
  // Operations: When performing operations in a transaction, you need to pass the session object to each operation (e.g., Model.create() or Model.updateOne()).
    const session = await mongoose.startSession();

  try {
      // Start the transaction
      session.startTransaction();
      
      // Perform multiple operations
      const doc = await models.test.create([{ name: 'ff' }], { session })
      await models.test.updateOne({ name: 'ff' }, { name:  doc[0]._id  },{session})

      // Commit the transaction if everything goes well
      await session.commitTransaction();
      console.log('Transaction committed!');
      res.send('transaction Completed')

  } catch (error) {
      // If an error occurs, abort the transaction and roll back changes
      await session.abortTransaction();
      console.error('Transaction aborted!', error);
      next ( new app_error_feedback( 500,error ) )

  } finally {
      // End the session
      session.endSession();
  }

})


exports.test2 = catchAsync(async(req,res,next)=>{


})