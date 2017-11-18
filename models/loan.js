
module.exports = (sequelize, DataTypes) => sequelize.define('Loan', {
  book_id: {
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true,
      isInt: true,
    },
  },
  patron_id: {
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true,
      isInt: true,
    },
  },
  loaned_on: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  return_by: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: true,
    },
  },
  returned_on: {
    type: DataTypes.DATEONLY,
  },
}, {
  timestamps: false,
});
