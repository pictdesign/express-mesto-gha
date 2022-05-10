const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema ({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  avatar: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("user", UserSchema);
