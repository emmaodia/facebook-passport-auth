const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    facebook_id: String
})

module.exports = mongoose.model("User", userSchema);