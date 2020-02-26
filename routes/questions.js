const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Question model
const Question = require('../models/Questions');

// //Questions Index
//  router.get('/', (req, res) => {
//     res.render('questions/index')
//  });

//Add question page
router.get('/add', (req, res) => {
    res.render('questions/add')
});

//Handle add idea form
router.post('/add', (req, res) => {
    const {question, details, optionA, optionB, optionC, optionD} = req.body;
    //console.log(req.body);
    
    let errors = [];
    if(!question||!details  ||!optionA ||!optionB ||!optionC ||!optionD){
        errors.push({text:'Please add title'});
    }
    if(errors.length > 0){
        res.render('questions/add', {
            errors,
            question,
            details,
            optionA,
            optionB,
            optionC,
            optionD
        });
    }else{
        const newQuestion = new Question({
            question,
            details,
            optionA,
            optionB,
            optionC,
            optionD
        });
        newQuestion.save()
        .then(question => res.redirect('/questions'))
        .catch(err => console.log(err))
    }
});

//Questions index page
router.get('/', (req, res)=>{
    Question.find({})
    .sort({date:'desc'})
    .then(questions =>{
        res.render('questions/index', {questions:questions})
        
    });
})
//Edit question pages
router.get('/edit/:id', (req, res)=>{
    Question.findOne({
        _id:req.params.id
    })
    .then(question=>{
        res.render('questions/edit', {
            question:question
        });
    }).catch(err => console.log(err));
});

//Handle Edit question page
 router.put('/:id', (req, res) => {
    Question.findOne({
        _id: req.params.id
    })
    .then(question => {
        question.question = req.body.question;
        question.details = req.body.details;
        question.optionA = req.body.optionA;
        question.optionB = req.body.optionB;
        question.optionC = req.body.optionC;
        question.optionD = req.body.optionD;

        question.save()
        .then(question => {
            res.redirect('/questions/')
        })
    })
   // res.render('questions/edit')
 });

 //Delete questions
 router.delete('/:id', (req, res) =>{
     
 })



module.exports = router;