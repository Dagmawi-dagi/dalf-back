const { Sequelize } = require('sequelize');

const sequelize = new Sequelize( process.env.MYSQL_DBNAME , process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST , // or your database host IP/domain
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mariadb', 'mssql'
  port: 3306,       // Optional: Defaults are usually fine (e.g., 3306 for MySQL, 5432 for PostgreSQL)
  logging: false
});

// Export sequelize instance immediately so that it will be used for creating model  
module.exports = { sequelize };
// here create all the tables you need before conecting to be if incase not created ... if created GOOD!
// Ensure all models are imported and associations are initialized
const test = require('../models/test').model;
const blog = require('../models/compnay_website/blog').model;
const news_letter = require('../models/compnay_website/news_letter').model;
const newsletter_subs = require('../models/compnay_website/newsletter_subs').model;
const vacancy = require('../models/HR/vacancy').model;
const vacancy_application = require('../models/HR/vacancy_application').model;
const user = require('../models/user').model;

const models = {
  test,
  user,
  blog,
  news_letter,
  newsletter_subs,
  vacancy,
  vacancy_application
};

// Initialize associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// connect 
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
    await sequelize.sync(); //  with options {force: true} it will delete and recreate the talbes  
    console.log('Database synced');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

async function startApp() {  await connectDB() }
startApp()