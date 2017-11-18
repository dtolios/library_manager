
module.exports = (sequelize, DataTypes) => sequelize.define('Patron', {
  first_name: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  last_name: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  address: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  library_id: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  zip_code: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
    },
  },
}, {
  timestamps: false,
});
