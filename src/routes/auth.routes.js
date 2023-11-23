const Router = require("express");

const {
  login,
  register,
  logout,
  profile,
  verifyToken,
} = require("../controllers/auth.controller.js");
const { authRequired } = require("../middleware/validateToken.js");
const { validateSchema } = require("../middleware/validator.middleware.js");
const { registerSchema, loginSchema } = require("../schemas/auth.schema.js");

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
router.get("/profile", authRequired, profile);

module.exports = router;
