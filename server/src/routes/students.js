const express = require('express')
const service = require('../services/studentService')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const students = await service.getAll(req.query)
    res.json({ data: students })
  } catch (err) {
    next(err)
  }
})

router.get('/:studentId', async (req, res, next) => {
  try {
    const student = await service.getById(req.params.studentId)
    res.json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const student = await service.create(req.body)
    res.status(201).json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.put('/:studentId', async (req, res, next) => {
  try {
    const student = await service.update(req.params.studentId, req.body)
    res.json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.put('/:studentId/grades', async (req, res, next) => {
  try {
    const student = await service.upsertGrades(req.params.studentId, req.body)
    res.json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.delete('/:studentId', async (req, res, next) => {
  try {
    await service.remove(req.params.studentId)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = router
