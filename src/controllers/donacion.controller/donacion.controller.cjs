const Donacion = require('../modelo/modelo.donacion.cjs');

const guardarDonacion = async (req, res) => {
  try {
    const nuevaDonacion = new Donacion(req.body);
    await nuevaDonacion.save();
    res.status(201).json({ message: 'Donación guardada exitosamente' });
  } catch (error) {
    console.error('Error al guardar la donación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  guardarDonacion,
};