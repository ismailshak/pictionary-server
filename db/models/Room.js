const mongoose = require('../connection')
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: String,
    creator: String,
    active: { type: Boolean, default: false}
})

module.exports = mongoose.model("Room", roomSchema)