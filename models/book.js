'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Book', {
        title: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: true
          }
        },
        author: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: true
          }
        },
        genre: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: true
          }
        },
        first_published: {
          type: DataTypes.INTEGER
        }
      }, {
        timestamps: false
      });
};