require('dotenv').config()
const express = require('express')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3000

db.connect()

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
