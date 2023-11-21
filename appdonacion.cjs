const express = require('express');
const morgan = require('morgan');
const router = require('../router/router.cjs');
const cors = require('cors')
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);  

app.use('*', (req, res) => res.status(404).send('404-no se encontro nada'));

module.exports = app;
