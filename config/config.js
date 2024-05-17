const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DB_NAME,
    host: process.env.HOST_DB,
    dialect: 'mysql',
  },
};
