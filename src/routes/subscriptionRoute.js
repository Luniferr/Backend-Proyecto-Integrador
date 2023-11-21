const subscriptionRoute = require("express").Router();
const {
  crearSubscription, eliminarSubscription
} = require("../controllers/subscriptionController.js");

subscriptionRoute.post("/submitSubscription", crearSubscription);
subscriptionRoute.delete("/deleteSubscription", eliminarSubscription);

module.exports = subscriptionRoute;
