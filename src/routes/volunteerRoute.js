const volunteerRoute = require("express").Router();
const { validateObjectId } = require("../middleware/validationMiddleware")

const {
  crearVolunteer,
  editarVolunteer,
  obtenerVolunteerById,
  eliminarVolunteer,
} = require("../controllers/volunteerController");

volunteerRoute.post("/volunteer-register", crearVolunteer);
volunteerRoute.put("/update-volunteer/:idvolunteer", validateObjectId, editarVolunteer);
volunteerRoute.get("/volunteer-list/:idvolunteer",validateObjectId, obtenerVolunteerById);
volunteerRoute.delete("/delete-volunteer/:idvolunteer", validateObjectId, eliminarVolunteer);



module.exports = volunteerRoute;
