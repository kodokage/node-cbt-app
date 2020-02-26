const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


//Users model
const User = require('../models/Users');


//User register
router.get('/register', (req, res) => {
    res.render('register')
});

//User register
router.get('/login', (req, res) => {
    res.render('login')
});

//Handle registration form
router.post('/register', (req, res) => {
    const {name, email, password, password2}= req.body;
    let errors = [];
 
    //Checking required fields
    if(!name || !email || !password || !password2){
        errors.push({msg : 'Please fill all fields'});
    }
     //Checking if passwords match
    if(password != password2){
        errors.push({msg:'Passwords do not match'});
    }
 //Checking pasword length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'});
    }
 
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
     }else{
      //validation passed
      User.findOne({email: email})
      .then(user => {
         if(user){
             //User exists
             errors.push({msg:'Email already registered'});
             res.render('register', {
                 errors,
                 name,
                 email,
                 password,
                 password2
             });
         }else{
             const newUser = new User({
                 name,
                 email,
                 password
             });
             //Hash password
             bcrypt.genSalt(10, (err, salt) => 
              bcrypt.hash(newUser.password, salt, (err, hash )=> {
                 if(err) throw err;
                 //set password to hashed
                 newUser.password = hash;
                 //Save User
                 newUser.save()
                 .then(user => {
                    // req.flash('success_msg', 'You are now registered');
                     res.redirect('/users/login');
                 })
                 .catch(err => console.log(err));
             }));
         }
      });
          
         
     }
 
 });



module.exports = router;