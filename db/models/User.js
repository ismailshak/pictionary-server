const mongoose = require('../connection')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, unique: true, require: true},
    password: {type: String, require: true},
})

module.exports = mongoose.model("User", userSchema)