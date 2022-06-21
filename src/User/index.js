const { Model, DataTypes } = require('sequelize');
const { database } = require('../database');

const User = database.define(
  'users',
  {
    name: {
      type: DataTypes.TEXT,
      validate: {
        notNull: { msg: 'Name field should not be Null.' },
        notEmpty: { msg: 'Name field should not be Empty.' },
        isAlpha: {
          msg: 'Name field should be letters.',
        },
      },
      unique: true,
      allowNull: false,
    },
    gender: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: {
          msg: 'Age field should be numeric value',
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

User.readAll = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.send({ users });
  } catch (error) {
    return res.status(403).send(error);
  }
};

User.addUser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create(req.body);
    return res.send({ user });
  } catch (error) {
    return res.status(403).send(error);
  }
};

User.updateUser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.update(req.body, { returning: true, where: '' });
    return res.send({ user });
  } catch (error) {
    return res.status(403).send(error);
  }
};

module.exports = { User };
