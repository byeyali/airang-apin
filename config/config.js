require('dotenv').config(); // .env 사용 가능하게

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'yangyeonhee',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'airangSsam',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};