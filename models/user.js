const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseOptions = {
    discriminatorKey: "usertype", // our discriminator key, could be anything
    collection: "users" // the name of our collection
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    mobilePhone: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    birthDate: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    permission: {
      type: String,
      enum: ["User", "Admin", "Doctor"],
      default: "User"
    }
  },
  baseOptions
);

module.exports = mongoose.model('User', userSchema);