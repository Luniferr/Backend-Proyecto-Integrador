const express = require("express");
const Map = require("../models/map.model");

//gestionar obtener comuna

const getComunaById = async (req, res) => {
  const Ncomuna = req.params.comuna;
  const comuna = await Map.find({ comuna: Ncomuna });
  if (comuna) {
    res.json(comuna);
  } else {
    res.status(404).json({ error: "Comuna no encontrada" });
  }
};

//gestionar añadir comuna
const postComuna = async (req, res) => {
  const { comuna, habitantes, municipalidad, donaciones } = req.body;

  try {
    await Map.create({
      comuna: comuna,
      habitantes: habitantes,
      municipalidad: municipalidad,
      donaciones: donaciones,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al añadir comuna" });
  }

  res.send("comuna añadida correctamente");
};

module.exports = { getComunaById, postComuna };
