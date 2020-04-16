const express = require('express');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const multer = require('multer');
const path = require('path');



const app = express();

//Passport config
require('./config/passport')(passport);

//Remove mongoose deprecation warning
mongoose.Promise = global.Promise;

//connect to mongodb
mongoose.connect('mongodb://localhost/node_cbt', {useNewUrlParser:true})
.then(()=> console.log('Mongodb connected'))
.catch(err => console.log(err));


//Handlebars view middleware
app.engine('handlebars', expressHandlebars({
    defaultLayout:'main'
}));
//app.use(expressHandlebars);
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override middleware for form methods
app.use(methodOverride('_method'));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
  app.use(function(req, res, next){
      res.locals.success_msg = req. flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
  })



///////////////Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/questions', require('./routes/questions'));


//Use static files
app.use(express.static('public'));
const PORT = 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));