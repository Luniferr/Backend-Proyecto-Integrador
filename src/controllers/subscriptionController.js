const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const accountTransport = require("../../account_transport.json");
const Subscription = require("../models/subscriptionModel");

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
    subject: "¡Bienvenido a Canastas de Vida!",
    text: "¡Gracias por suscribirte a nuestro boletín informativo!",
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
    subject: "Cancelación Suscripción Canastas de Vida",
    text: "Lamentamos ver que te has dado de baja de nuestro boletín informativo. Como Proyecto Saciarte, ¡esperamos verte de nuevo pronto!",
  };
  emailTransporter.sendMail({
    from: "proyectosaciarte@gmail.com",
    to: userEmail,
    subject: json.subject,
    text: json.text,
  });
};


const crearSubscription = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({
      msg: "Campo email requerido",
      status: 404,
    });
  }

  try {
    await Subscription.create({
      email: email,
    });

    res.status(201).json({
      msg: "Subscripción enviada correctamente",
      status: 201,
    });

    mailProyectoSaciarte(function (emailTransporter) {
      
      sendWelcomeEmail(emailTransporter, email);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al enviar subscripción",
      status: 500,
    });
  }
};


const eliminarSubscription = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({
      msg: "Campo email requerido",
      status: 404,
    });
  }

  try {
    await Subscription.deleteOne({
      email: email,
    });

    res.status(201).json({
      msg: "Subscripción anulada correctamente",
      status: 201,
    });

    mailProyectoSaciarte(function (emailTransporter) {
      
      sendCancellationEmail(emailTransporter, email);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al eliminar subscripción",
      status: 500,
    });
  }
};

module.exports = { crearSubscription, eliminarSubscription };
