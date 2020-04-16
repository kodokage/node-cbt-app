const mongoose = require('mongoose');

const QuestionSChema = new mongoose.Schema ({
    question:{       
        type : String,
        required : true
    },
    details:{
        type: String,
        required: true
    },
    optionA:{
        type: String,
        required: true
    },
    optionB:{
        type: String,
        required: true
    },
    optionC:{
        type: String,
        required: true
    },
    optionD:{
        type: String,
        required: true
    },
    answer:{
        type: String,
        required: true
    },
    imageSrc:{
        type: String,
        required: false
    },
    date:{
        type: Date,
        default : Date.now
    }
});

const Question = mongoose.model('Question', QuestionSChema);

module.exports = Question;