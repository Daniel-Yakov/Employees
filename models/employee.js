const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    name: String,
    age: Number,
    salary: Number
})

module.exports = mongoose.model('Employee', EmployeeSchema)