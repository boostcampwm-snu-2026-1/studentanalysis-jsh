const express = require('express')
const analysisService = require('../services/analysisService')

const router = express.Router({ mergeParams: true })

router.get('/:studentId/analysis', async (req, res, next) => {
  try {
    const analysis = await analysisService.getByStudentId(req.params.studentId)
    res.json({ data: analysis })
  } catch (err) {
    next(err)
  }
})

router.post('/:studentId/analyze', async (req, res, next) => {
  try {
    const { inputText } = req.body
    if (!inputText) throw { status: 400, message: 'inputText는 필수입니다.' }
    const analysis = await analysisService.runAndSave(req.params.studentId, inputText)
    res.status(201).json({ data: analysis })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const analysis = await analysisService.getById(req.params.id)
    res.json({ data: analysis })
  } catch (err) {
    next(err)
  }
})

module.exports = router
