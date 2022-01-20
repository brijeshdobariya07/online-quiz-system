const mongoose = require('mongoose');

const examOptionsSchema = new mongoose.Schema({
        answer_a:"String",
        answer_b:"String",
        answer_c:"String",
        answer_d:"String"
})

// const ExamQuestion = mongoose.model('ExamQuestion',examOptionsSchema);

module.exports = examOptionsSchema;