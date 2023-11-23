const mongoose = require('mongoose');
const {Schema} = mongoose;

const mapSchema = new Schema({
    comuna : String,
    habitantes : String,
    municipalidad : String,
    donaciones : Array
})

const Map = mongoose.model('Map', mapSchema);

module.exports = Map;