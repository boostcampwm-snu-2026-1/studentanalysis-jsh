// @ts-nocheck
const Analysis = require('../models/Analysis')

const create = (data) => Analysis.create(data)

const findByStudentId = (studentId) =>
  Analysis.find({ studentId }).sort({ createdAt: -1 })

const findById = (id) => Analysis.findById(id)

module.exports = { create, findByStudentId, findById }
