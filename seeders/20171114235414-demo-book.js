'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Books', [{
          title: "Harry Potter and the Philosopher's Stone",
          author: "J.K. Rowling",
          genre: "Fantasy",
          first_published: 1997
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Book', null, {});
  }
};
