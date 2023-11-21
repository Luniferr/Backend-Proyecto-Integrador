const express = require('express');
const router = express.Router();
const { guardarDonacion } = require('../controlador/donacion.controller.cjs');

router.post('/donaciones', guardarDonacion);

module.exports = router;