require('dotenv').config()
const express = require('express')
const cors = require('cors');
const Employee = require('./models/employee');
const { connectMongo } = require('./models/connection')
var expressWinston = require('express-winston');
var { transports, format } = require('winston'); // for transports.Console

const app = express()

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

app.use(cors()) // allow access from jquey on client side

// Config logs
app.use(expressWinston.logger({
    transports: [
      new transports.Console()
    ],
    format: format.combine(
      format.timestamp(),
      format.json()
    ),
    statusLevels: true
  }));


// Connect to mongoDB
const dbUri = process.env.MONGO_URI
connectMongo(dbUri)

// Health check
app.get('/employees/health', async (req, res) => {
    res.json({
        status: "OK"
    })
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

// Get specific employee
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