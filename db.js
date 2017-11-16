'use strict';

const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/config/config.json')[env];
const db        = {};

const sequelize = (config.use_env_variable) ?
  new Sequelize(process.env[config.use_env_variable]) : new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Add all the models/tables to the db object so they are easily accessible
 */
db.book = require('./models/book')(sequelize, Sequelize);
db.loan = require('./models/loan')(sequelize, Sequelize);
db.patron = require('./models/patron')(sequelize, Sequelize);

/**
 * Create the associations between models
 */
db.loan.belongsTo(db.book);
db.book.hasOne(db.loan);

module.exports = db;

