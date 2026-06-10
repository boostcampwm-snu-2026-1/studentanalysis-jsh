import { Router, Request, Response, NextFunction } from 'express'
import * as service from '../services/studentService'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await service.getAll(req.query)
    res.json({ data: students })
  } catch (err) {
    next(err)
  }
})

router.get('/:studentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await service.getById(req.params['studentId'] as string)
    res.json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await service.create(req.body)
    res.status(201).json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.put('/:studentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await service.update(req.params['studentId'] as string, req.body)
    res.json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.put('/:studentId/grades', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await service.upsertGrades(req.params['studentId'] as string, req.body)
    res.json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.put('/:studentId/mock-exams', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await service.upsertMockExam(req.params['studentId'] as string, req.body)
    res.json({ data: student })
  } catch (err) {
    next(err)
  }
})

router.delete('/:studentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.remove(req.params['studentId'] as string)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
