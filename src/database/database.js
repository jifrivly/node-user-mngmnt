const { Sequelize } = require('sequelize');

const credentials = {
  user: 'jifri',
  host: 'localhost',
  database: 'factweavers',
  password: 'admin@123',
  port: 5432,
};

const DATABASE_URL = `postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;

const database = new Sequelize(DATABASE_URL);

module.exports = { credentials, database };
