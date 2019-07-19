const mongoose = require('../connection')
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: String,
    creator: String,
})

module.exports = mongoose.model("Room", roomSchema)