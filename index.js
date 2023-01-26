const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const Employee = require('./models/employee')

const app = express()

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

app.use(cors()) // allow access from jquey on client side


// Connect to mongoDB
const dbUri = "mongodb://172.17.0.2:27017/employees"
mongoose.connect(dbUri).then(() => { console.log('Database connected'); })

// Home page
app.get('/', async (req, res) => {
    res.send('home')
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
    try {
        const employees = await Employee.findById(req.params.id)
        res.json(employees)
    } catch  {
        res.status(400).json({
            errorMessage: "Id not valid"
        })
    }
})

// Update specific employee
app.put('/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, req.body)
        const employee = await Employee.findById(req.params.id)
        res.json(employee)
    } catch (error) {
        res.status(400).json({
            errorMessage: "Id not valid"
        })
    }
})

// Delete specific employee
app.delete('/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({
            status: 'OK'
        })
    } catch (error) {
        res.status(400).json({
            errorMessage: "Id not valid"
        })
    }
})



app.listen(3000, () => {
    console.log('Serving on port 3000');
})