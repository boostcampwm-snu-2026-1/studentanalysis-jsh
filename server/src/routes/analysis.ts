import { Router, Request, Response, NextFunction } from 'express'
import * as analysisService from '../services/analysisService'
import { AppError } from '../types'

const router = Router({ mergeParams: true })

router.get('/:studentId/analysis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analysis = await analysisService.getByStudentId(req.params['studentId'] as string)
    res.json({ data: analysis })
  } catch (err) {
    next(err)
  }
})

router.post('/:studentId/analysis/init', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inputText } = req.body as { inputText?: string }
    if (!inputText) throw { status: 400, message: 'inputText는 필수입니다.' } as AppError
    const analysis = await analysisService.initAnalysis(req.params['studentId'] as string, inputText)
    res.status(201).json({ data: analysis })
  } catch (err) {
    next(err)
  }
})

router.post('/:analysisId/step', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { step } = req.body as { step?: string }
    if (!step) throw { status: 400, message: 'step은 필수입니다.' } as AppError
    const analysis = await analysisService.runStep(req.params['analysisId'] as string, step)
    res.json({ data: analysis })
  } catch (err) {
    next(err)
  }
})


router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analysis = await analysisService.getById(req.params['id'] as string)
    res.json({ data: analysis })
  } catch (err) {
    next(err)
  }
})

export default router
