import { Router, Request, Response, NextFunction } from 'express'
import * as consultationService from '../services/consultationService'

const studentConsultationsRouter = Router({ mergeParams: true })
const consultationsRouter = Router()

studentConsultationsRouter.get('/:studentId/consultations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultations = await consultationService.getByStudentId(req.params['studentId'] as string)
    res.json({ data: consultations })
  } catch (err) {
    next(err)
  }
})

consultationsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultation = await consultationService.create(req.body)
    res.status(201).json({ data: consultation })
  } catch (err) {
    next(err)
  }
})

consultationsRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consultation = await consultationService.update(req.params['id'] as string, req.body)
    res.json({ data: consultation })
  } catch (err) {
    next(err)
  }
})

export { studentConsultationsRouter, consultationsRouter }
