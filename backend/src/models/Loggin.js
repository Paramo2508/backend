const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB } = require("../config/db.js");
const bcrypt = require("bcrypt");

const Loggin = sequelize_loggin.define(
  "Loggin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING, // Token para refrescar el token de acceso
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING, // Token temporal para recuperar contraseña
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE, // Fecha de expiración del token
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

module.exports = Loggin;
