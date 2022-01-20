const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type:'String',
        required:true
    },
    rollno:{
        type:'Number',
        required:true,
    },
    testName:{
        type:'String',
    },
    testCode:{
        type:'String',
        required:true
    },
    marks:{
        type:'Number'
    }
})

const Student = mongoose.model('Student',studentSchema);

module.exports = Student