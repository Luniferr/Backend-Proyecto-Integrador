const mongoose = require("mongoose");

const { Schema } = mongoose;

const volunteerSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  rut: {
    type: String,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  ocupation: {
    type: String,
    require: true,
    Option: {
      value: "Estudiante",
      value: "Trabajador",
      value: "Jubilado",
      value: "Otro",
    },
  },
  residence: {
    type: String,
    require: true,
    Option: {
      value: "Santiago",
      value: "Providencia",
      value: "LasCondes",
      value: "LaReina",
      value: "Ñuñoa",
      value: "Macul",
      value: "Peñalolen",
      value: "LaFlorida",
      value: "PuenteAlto",
      value: "Maipu",
      value: "Renca",
      value: "Quilicura",
      value: "Huechuraba",
      value: "Recoleta",
      value: "Independencia",
      value: "Conchalí",
      value: "Vitacura",
      value: "LoBarnechea",
      value: "Peñaflor",
      value: "Pudahuel",
      value: "CerroNavia",
      value: "QuintaNormal",
      value: "LoPrado",
      value: "EstacionCentral",
      value: "LoEspejo",
      value: "PedroAguirre",
      value: "SanMiguel",
      value: "SanJoaquin",
      value: "LaGranja",
      value: "LaCisterna",
      value: "ElBosque",
      value: "SanBernardo",
      value: "LaPintana",
      value: "Colina",
    },
  },
  motivation: {
    type: String,
    require: true,
  },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
