const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const todoData = new Schema({
    userName:String,
    Tittle:  String,
    Description: String
  })

module.exports = mongoose.model("task", todoData);

