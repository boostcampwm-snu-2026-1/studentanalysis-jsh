const Student = require('../models/student')

const findAll = (filter = {}) => Student.find(filter).sort({ studentId: 1 })

const findById = (studentId) => Student.findOne({ studentId })

const create = (data) => Student.create(data)

const update = (studentId, data) =>
  Student.findOneAndUpdate({ studentId }, data, { new: true, runValidators: true })

const remove = (studentId) => Student.findOneAndDelete({ studentId })

module.exports = { findAll, findById, create, update, remove }
