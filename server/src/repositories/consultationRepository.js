const Consultation = require('../models/Consultation')

const create = (data) => Consultation.create(data)

const findByStudentId = (studentId) =>
  Consultation.find({ studentId }).sort({ consultedAt: -1 })

const update = (id, data) =>
  Consultation.findByIdAndUpdate(id, data, { new: true, runValidators: true })

module.exports = { create, findByStudentId, update }
