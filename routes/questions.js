const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Question model
const Question = require('../models/Questions');


//Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '_' + Date.now() + 
        path.extname(file.originalname));
    }
})
//Initialize upload
    const upload = multer({
    storage: storage ,
    limits: {fileSize: 2000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('questionImage');

//Check file type
function checkFileType(file, cb){
    //allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    //Check extentions
    const extname = filetypes.test(path.extname
        (file.originalname).toLowerCase());
    //Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: images only!');
    }
}


// //Questions Index
//  router.get('/', (req, res) => {
//     res.render('questions/index')
//  });

//Add question page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('questions/add')
});

//Handle add idea form
router.post('/add', ensureAuthenticated, (req, res) => {
    const {question, details, optionA, optionB, optionC, optionD, answer} = req.body;
    //console.log(req.body);
    
    let errors = [];
    if(!question||!details  ||!optionA ||!optionB ||!optionC ||!optionD || !answer){
        errors.push({text:'Please fill all fields'});
    }
    if(errors.length > 0){
        res.render('questions/add', {
            errors,
            question,
            details,
            optionA,
            optionB,
            optionC,
            optionD,
            answer
        });
    }else{
        const newQuestion = new Question({
            question,
            details,
            optionA,
            optionB,
            optionC,
            optionD,
            answer
        });
        newQuestion.save()
        .then(question => res.redirect('/questions'))
        .catch(err => console.log(err))
    }
});

//Add image form
router.post('/addimg', ensureAuthenticated, upload,(req, res, next) => {
    const {question, details, optionA, optionB, optionC, optionD, answer, imageSrc} = req.body;
    const image = req.file.filename;
    //console.log(req.body);
    
    let errors = [];
    if(!question||!details  ||!optionA ||!optionB ||!optionC ||!optionD || !answer ){
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
            optionD,
            answer
        });
    }else{
        const newQuestion = new Question({
            question,
            details,
            optionA,
            optionB,
            optionC,
            optionD,
            answer,
            imageSrc
        });
        newQuestion.imageSrc = image;
        newQuestion.save()
        .then(question => res.redirect('/questions'))
        .catch(err => console.log(err))
    }
});

//Questions index page
router.get('/', ensureAuthenticated, (req, res)=>{
    Question.find({})
    .sort({date:'desc'})
    .then(questions =>{
        res.render('questions/index', {questions:questions})
        
    });
})
//Edit question pages
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
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
 router.put('/:id', upload,(req, res) => {
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
        question.answer = req.body.answer;
        question.imageSrc = req.body.imageSrc;

        question.save()
        .then(question => {
            res.redirect('/questions/');
            //res.render('/questions/')
        })
    })
   // res.render('questions/edit')
 });

 //Delete questions
 router.delete('/:id',  (req, res) =>{
   Question.findOne({_id:req.params.id})
   .then(question => {
       //console.log(question.imageSrc);
       if(question.imageSrc){
       const jokative = question.imageSrc;
       //console.log(jokative);
       fs.unlink(`./public/uploads/${jokative}`, function(err){
           if(err){
               throw err
           }else{
               console.log('Successfully deleted');
                //res.redirect('/questions')               
           }
       })  
 }}).catch(err => console.log(err));

   Question.deleteOne({_id: req.params.id})
   .then(() => {
        res.redirect('/questions')
   }).catch(err => console.log(err))
});


 //Delete questions
//  router.delete('/:id', (req, res) =>{
//     Question.deleteOne({_id: req.params.id})
//     .then(()=>{
//         //req.flash('success_msg', 'Question removed');
//         res.redirect('/questions');
//     });
// });



module.exports = router;