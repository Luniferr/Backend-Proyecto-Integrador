const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../../config.js");
const User = require("../models/user.model.js");
const { createAccessToken } = require("../libs/jwt.js");

//esto tiene que recibir los datos en formato json // register
const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["the email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10); // #ksfjdhglskjfdghlfsd
    // lo que le pedimos al usuario para que ingrese en la base de datos
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });
    // lo que vamos a mostrar en el front end
    //guardamos el usuario
    const userSaved = await newUser.save();
    //creamos el token
    const token = await createAccessToken({
      id: userSaved._id,
    });
    // cookie en la respuesta
    res.cookie("token", token);
    //enviar la respuesta
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//esto tiene que recibir los datos en formato json // login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //comparar si el usuario existe
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password); // #ksfjdhglskjfdghlfsd
    if (!isMatch)
      return res.status(400).json({ message: "incorrect password" });

    //creamos el token
    const token = await createAccessToken({
      id: userFound._id,
    });
    // cookie en la respuesta
    res.cookie("token", token);
    //enviar la respuesta
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "unauthorized" });
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

module.exports = { register, login, logout, profile, verifyToken };
