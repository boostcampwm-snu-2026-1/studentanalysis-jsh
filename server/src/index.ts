// @ts-nocheck
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db')
const errorHandler = require('./middleware/errorHandler')

const studentsRouter = require('./routes/students')
const analysisRouter = require('./routes/analysis')
const { studentConsultationsRouter, consultationsRouter } = require('./routes/consultations')

const app = express()
const PORT = process.env.PORT || 3000

db.connect()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

app.use('/api/students', studentsRouter)
app.use('/api/students', analysisRouter)
app.use('/api/analysis', analysisRouter)
app.use('/api/students', studentConsultationsRouter)
app.use('/api/consultations', consultationsRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
