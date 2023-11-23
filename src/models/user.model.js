// forma de especificar los datos que vamos a guardar en mongoDB

const mongoose = require("mongoose");
// en el esquema podriamos tambn agregar validaciones a la contraseña pero se puede hacer tambn por la base de datos
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// se crea un esquema para crear una coleccion de usuarios
module.exports = mongoose.model("User", userSchema);
