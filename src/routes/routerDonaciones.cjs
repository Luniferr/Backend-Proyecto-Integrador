const express = require("express");
const router = express.Router();

const { guardarDonacion } = require("../controllers/donacion.controller.cjs");

router.post("/donacion", guardarDonacion);

module.exports = router;
