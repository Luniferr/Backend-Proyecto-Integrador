const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/auth.routes.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const subscriptionRouter = require("./src/routes/subscriptionRoute");
const volunteerRouter = require("./src/routes/volunteerRoute");
const router = require("./src/routes/routerDonaciones.cjs");
const maprouter = require("./src/routes/map.routes");

app.use(
  "/api/v1",
  authRoutes,
  subscriptionRouter,
  volunteerRouter,
  router,
  maprouter
);
app.use("*", (req, res) => res.status(404).send("404 - Ruta no encontrada"));

module.exports = app;
