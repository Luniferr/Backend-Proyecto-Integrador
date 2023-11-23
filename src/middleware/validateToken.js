const Jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../../config.js");

//funciones que se ejecutan antes de profile

const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  Jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid token" });

    req.user = user;

    next();
  });
};

module.exports = { authRequired };
