'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Book', {
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        genre: DataTypes.STRING,
        first_published: DataTypes.INTEGER
      }, {
        timestamps: false
      });
};