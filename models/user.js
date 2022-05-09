const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema ({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 30
  },
  about: {
    type: String,
    required: true,
    min: 2,
    max: 30
  },
  avatar: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("user", UserSchema);
