// const mongoose = require('mongoose')
const { Sequelize } = require('sequelize');

// mongoose.set('strictQuery', true);
// mongoose.connect(process.env.localMongoDB_URL)
//   .then(( ) => console.log('DB connected successfully'))
//   .catch(err=> console.log(err))

const sequelize = new Sequelize( process.env.MYSQL_DBNAME , process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST , // or your database host IP/domain
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mariadb', 'mssql'
  port: 3306,       // Optional: Defaults are usually fine (e.g., 3306 for MySQL, 5432 for PostgreSQL)
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

await connectDB();
await sequelize.sync() // This ensures tables are created

module.exports = sequelize