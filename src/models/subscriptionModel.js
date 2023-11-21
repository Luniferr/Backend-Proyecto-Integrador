const mongoose = require("mongoose");

const { Schema } = mongoose;


const subscriptionSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
});


const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
