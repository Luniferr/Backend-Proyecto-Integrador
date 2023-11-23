const mongoose = require("mongoose");

const { Schema } = mongoose;

const volunteerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  rut: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  phone: {
    type: Number,
    required: true,
    unique: false,
  },
  ocupation: {
    type: String,
    required: true,
    enum: ["Estudiante", "Trabajador", "Jubilado", "Otro"],
    unique: false,
  },
  residence: {
    type: String,
    required: true,
    enum: [
      "Santiago",
      "Providencia",
      "LasCondes",
      "LaReina",
      "Ñuñoa",
      "Macul",
      "Peñalolen",
      "LaFlorida",
      "PuenteAlto",
      "Maipu",
      "Renca",
      "Quilicura",
      "Huechuraba",
      "Recoleta",
      "Independencia",
      "Conchalí",
      "Vitacura",
      "LoBarnechea",
      "Peñaflor",
      "Pudahuel",
      "CerroNavia",
      "QuintaNormal",
      "LoPrado",
      "EstacionCentral",
      "LoEspejo",
      "PedroAguirre",
      "SanMiguel",
      "SanJoaquin",
      "LaGranja",
      "LaCisterna",
      "ElBosque",
      "SanBernardo",
      "LaPintana",
      "Colina",
    ],
    unique: false,
  },
  motivation: {
    type: String,
    required: true,
    unique: false,
  },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
