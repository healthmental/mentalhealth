const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./user"); // we have to make sure our doctor schema is aware of the user schema

const Doctor = User.discriminator( 'Doctor',
  mongoose.Schema({
    master: { type: String, required: true }
  })
);

module.exports = mongoose.model("Doctor"); 