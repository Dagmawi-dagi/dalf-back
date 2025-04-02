// const mongoose = require('mongoose')
const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');
// mongoose.set('strictQuery', true);
// mongoose.connect(process.env.localMongoDB_URL)
//   .then(( ) => console.log('DB connected successfully'))
//   .catch(err=> console.log(err))

const sequelize = new Sequelize( process.env.MYSQL_DBNAME , process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST , // or your database host IP/domain
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mariadb', 'mssql'
  port: 3306,       // Optional: Defaults are usually fine (e.g., 3306 for MySQL, 5432 for PostgreSQL)
  logging: false
});

// Export sequelize instance immediately so that it will be used for creating model  
module.exports = { sequelize };
// here create all the tables you need before conecting to be if incase not created ... if created GOOD!
require('../models/test2');
// connect 
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
    await sequelize.sync(); 
    console.log('Database synced');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

async function startApp() {  await connectDB() }
startApp()