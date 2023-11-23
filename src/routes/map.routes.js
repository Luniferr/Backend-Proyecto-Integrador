const maprouter = require("express").Router();
const { getComunaById, postComuna } = require('../controllers/map.controller');

// obtener una comuna
maprouter.get('/:comuna', getComunaById )

// añadir una comuna
maprouter.post("/addcomunas", postComuna);



module.exports = maprouter;