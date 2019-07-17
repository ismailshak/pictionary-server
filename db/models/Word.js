const mongoose = require('../connection')
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    name: String
})

module.exports = mongoose.model("Word", wordSchema)