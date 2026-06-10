import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { AppError } from '../types'

const errorHandler: ErrorRequestHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || '서버 오류가 발생했어요' })
}

export default errorHandler
