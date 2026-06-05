const express = require('express')
const consultationService = require('../services/consultationService')

const router = express.Router({ mergeParams: true })

router.get('/:studentId/consultations', async (req, res, next) => {
  try {
    const consultations = await consultationService.getByStudentId(req.params.studentId)
    res.json({ data: consultations })
  } catch (err) {
    next(err)
  }
})

module.exports = router
