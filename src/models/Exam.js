const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name:'String',
    email:'String',
    testName:{
        type:'String',
        required:true
    },
    testCode:{
        type:'String',
        required:true
    },
    newData:{
        // type:mongoose.Schema.Types.Mixed
        type:[
            {
                question:'String',
                answers:{
                //     type:[
                //         answer_a="String",
                //         answer_b="String",
                //         answer_c="String",
                //         answer_d="String"
                //     ]
                    answer_a:"String",
                    answer_b:"String",
                    answer_c:"String",
                    answer_d:"String"
                },
                correct_answer:"String"
            }
        ]
    }
}) 

const Exam = mongoose.model('Exam',examSchema);
module.exports = Exam;