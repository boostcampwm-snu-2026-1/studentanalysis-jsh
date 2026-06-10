import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import * as db from './db'
import errorHandler from './middleware/errorHandler'
import studentsRouter from './routes/students'
import analysisRouter from './routes/analysis'
import { studentConsultationsRouter, consultationsRouter } from './routes/consultations'

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
