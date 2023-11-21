const { Types } = require("mongoose");

const validateObjectId = (req, res, next) => {
  const { idvolunteer } = req.params;

  if (!Types.ObjectId.isValid(idvolunteer)) {
    return res.status(400).json({
      msg: "ID de voluntario no válido",
      status: 400,
    });
  }

  next();
};

module.exports = { validateObjectId };
