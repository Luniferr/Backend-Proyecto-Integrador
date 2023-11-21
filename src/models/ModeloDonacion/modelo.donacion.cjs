const mongoose = require("mongoose");

const { Schema } = mongoose;

const donacionSchema = new Schema({
    montoDonacion: Number,
    destinoDonacion: String,
    

});


const Donacion = mongoose.model('Donacion', donacionSchema);


module.exports = Donacion;