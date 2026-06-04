const express = require('express')
const analysisService = require('../services/analysisService')

const router = express.Router({ mergeParams: true })

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

module.exports = router
