const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    name: String,
    age: String,
    position: String,
    salary: String
})

module.exports = mongoose.model('Employee', EmployeeSchema)