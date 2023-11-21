const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const accountTransport = require("../../account_transport.json");
const Volunteer = require("../models/volunteerModel");
const { validateRut } = require("rutlib");
const { Types } = require("mongoose");
const { body, validationResult } = require("express-validator");



const mailProyectoSaciarte = async (callback) => {
  console.log("Credenciales del proyecto:", accountTransport);

  const oauth2Client = new OAuth2(
    accountTransport.auth.clientId,
    accountTransport.auth.clientSecret,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({
    refresh_token: accountTransport.auth.refreshToken,
    tls: {
      rejectUnauthorized: false,
    },
  });

  if (oauth2Client.isTokenExpiring()) {
    try {
      const { token } = await oauth2Client.refreshAccessToken();
      accountTransport.auth.accessToken = token;
    } catch (error) {
      console.error("Error al renovar el token de acceso:", error);
    }
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "proyectosaciarte@gmail.com",
      clientId: accountTransport.auth.clientId,
      clientSecret: accountTransport.auth.clientSecret,
      refreshToken: accountTransport.auth.refreshToken,
      accessToken: accountTransport.auth.accessToken,
    },
  });

  callback(transporter);

  oauth2Client.getAccessToken((err, token) => {
    if (err) return console.log(err);
    accountTransport.auth.accessToken = token;
    callback(nodemailer.createTransport(accountTransport));
  });
};

const sendWelcomeEmail = (emailTransporter, userEmail) => {
  console.log("Enviando correo de bienvenida a:", userEmail);

  const json = {
    subject: "¡Bienvenido a la Comunidad de Voluntarios!",
    text: "¡Gracias por ser parte de nuestro proyecto!",
  };
  emailTransporter.sendMail({
    from: "proyectosaciarte@gmail.com",
    to: userEmail,
    subject: json.subject,
    text: json.text,
  });
};

const sendCancellationEmail = (emailTransporter, userEmail) => {
  console.log("Enviando correo de cancelación a:", userEmail);

  const json = {
    subject: "Te has Dado de Baja de la Comunidad de Voluntarios",
    text: "Lamentamos ver que decides marcharte. Como Proyecto Saciarte, estaremos eternamente agradecidos por tu aporte, y esperamos tenerte de vuelta pronto!",
  };
  emailTransporter.sendMail({
    from: "proyectosaciarte@gmail.com",
    to: userEmail,
    subject: json.subject,
    text: json.text,
  });
};


const crearVolunteer = async (req, res) => {
  const { name, rut, age, email, phone, ocupation, residence, motivation } =
    req.body;

  const validationRules = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("rut").notEmpty().withMessage("El RUT es requerido"),
    body("age").notEmpty().withMessage("La edad es requerida"),
    body("email")
      .notEmpty()
      .withMessage("El email es requerido")
      .isEmail()
      .withMessage("Formato de email no válido"),
    body("phone").notEmpty().withMessage("El teléfono es requerido"),
    body("ocupation").notEmpty().withMessage("La ocupación es requerida"),
    body("residence").notEmpty().withMessage("La residencia es requerida"),
    body("motivation").notEmpty().withMessage("La motivación es requerida"),
  ];

  await Promise.all(
    validationRules.map((validationRule) => validationRule.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: "Error de validación",
      status: 400,
      errors: errors.array(),
    });
  }

  if (!validateRut(rut)) {
    return res.status(400).json({
      msg: "Rut no válido",
      status: 400,
    });
  }

  try {
    await Volunteer.create({
      name: name,
      rut: rut,
      age: age,
      email: email,
      phone: phone,
      ocupation: ocupation,
      residence: residence,
      motivation: motivation,
    });

    res.status(201).json({
      msg: "Aplicación de Voluntario enviada correctamente",
      status: 201,
    });

    mailProyectoSaciarte(function (emailTransporter) {
      sendWelcomeEmail(emailTransporter, email);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al enviar aplicación de voluntario",
      status: 500,
      error: error.message,
    });
  }
};

const editarVolunteer = async (req, res) => {
  const { idvolunteer } = req.params;
  const { name, age, email, phone, ocupation, residence, motivation } =
    req.body;

  if (!idvolunteer) {
    return res.status(400).json({
      msg: "Id de usuario es requerido",
      status: 400,
    });
  }

  if (!Types.ObjectId.isValid(idvolunteer)) {
    return res.status(400).json({
      msg: "ID de voluntario no válido",
      status: 400,
    });
  }

  const volunteerChanges = {
    name: name,
    age: age,
    email: email,
    phone: phone,
    ocupation: ocupation,
    residence: residence,
  };

  try {
    await Volunteer.findByIdAndUpdate(idvolunteer, volunteerChanges);
    res.status(200).json({
      msg: "Voluntario actualizado correctamente",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al actualizar el voluntario",
      status: 500,
      error: error.message,
    });
  }
}

const obtenerVolunteerById = async (req, res) => {
  const { idvolunteer } = req.params;

  if (!idvolunteer) {
    return res.status(404).json({
      msg: "Id de usuario es requerido",
      status: 404,
    });
  }

  if (!Types.ObjectId.isValid(idvolunteer)) {
    return res.status(400).json({
      msg: "ID de voluntario no válido",
      status: 400,
    });
  }

  try {
    const volunteer = await Volunteer.findOne({ _id: idvolunteer });

    if (!volunteer) {
      return res.status(404).json({
        msg: "Voluntario no encontrado",
        status: 404,
      });
    }

    res.status(200).json({
      msg: "Voluntario encontrado exitosamente",
      data: {
        name: volunteer.name,
        rut: volunteer.rut,
        age: volunteer.age,
        email: volunteer.email,
        phone: volunteer.phone,
        ocupation: volunteer.ocupation,
        residence: volunteer.residence,
        motivation: volunteer.motivation,
      },
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al buscar el voluntario",
      status: 500,
      error: error.message,
    });
  }
};

const eliminarVolunteer = async (req, res) => {
  const { idvolunteer } = req.params;

  if (!idvolunteer) {
    return res.status(404).json({
      msg: "Id de usuario es requerido",
      status: 404,
    });
  }

  if (!Types.ObjectId.isValid(idvolunteer)) {
    return res.status(400).json({
      msg: "ID de voluntario no válido",
      status: 400,
    });
  }

  try {
    const volunteer = await Volunteer.findByIdAndDelete(idvolunteer);

    if (!volunteer) {
      return res.status(404).json({
        msg: "Voluntario no encontrado",
        status: 404,
      });
    }

    res.status(201).json({
      msg: "Voluntario eliminado correctamente",
      status: 201,
    });

    mailProyectoSaciarte(function (emailTransporter) {
      sendCancellationEmail(emailTransporter, email);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al buscar el voluntario",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  crearVolunteer,
  editarVolunteer,
  obtenerVolunteerById,
  eliminarVolunteer,
};
