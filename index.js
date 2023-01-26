const express = require('express')
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose')
const Employee = require('./models/employee')

const app = express()

// ejs config
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(express.json()); // For parsing application/json

// Connect to mongoDB
const dbUri = "mongodb://172.17.0.2:27017/employees"
mongoose.connect(dbUri).then(() => { console.log('Database connected'); })

// Home page
app.get('/', async (req, res) => {
    res.send('OK')
})

// Render all employees
app.get('/employees', async (req, res) => {
    const employees = await Employee.find({})
    res.json(employees)
})

// Create new employee
app.post('/employees', async (req, res) => {
    const employee = new Employee(req.body)
    await employee.save()
    const employeeSaved = await Employee.findById(employee._id)
    res.json(employeeSaved)
})

// Render specific employee
app.get('/employees/:id', async (req, res) => {
    const employees = await Employee.findById(req.params.id)
    res.json(employees)
})

// Update specific employee
app.put('/employees/:id', async (req, res) => {
    await Employee.findByIdAndUpdate(req.params.id, req.body)
    const employee = await Employee.findById(req.params.id)
    res.json(employee)
})

// Delete specific employee
app.delete('/employees/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({
        status: 'OK',
        state: 'deleted'
    })
})



app.listen(3000, () => {
    console.log('Serving on port 3000');
})