// @ts-nocheck
const express = require('express')
const consultationService = require('../services/consultationService')

const studentConsultationsRouter = express.Router({ mergeParams: true })
const consultationsRouter = express.Router()

studentConsultationsRouter.get('/:studentId/consultations', async (req, res, next) => {
  try {
    const consultations = await consultationService.getByStudentId(req.params.studentId)
    res.json({ data: consultations })
  } catch (err) {
    next(err)
  }
})

consultationsRouter.post('/', async (req, res, next) => {
  try {
    const consultation = await consultationService.create(req.body)
    res.status(201).json({ data: consultation })
  } catch (err) {
    next(err)
  }
})

consultationsRouter.put('/:id', async (req, res, next) => {
  try {
    const consultation = await consultationService.update(req.params.id, req.body)
    res.json({ data: consultation })
  } catch (err) {
    next(err)
  }
})

module.exports = { studentConsultationsRouter, consultationsRouter }
