const errorHandler = (err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || '서버 오류가 발생했어요' })
}

module.exports = errorHandler
