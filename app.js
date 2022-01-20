const express = require('express');
const path = require('path');
const ejs = require('ejs'); 
require('./src/db/conn');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

// Passport Config
require('./config/passport')(passport);

// Middleware
app.use('/css',express.static(path.join(__dirname,'./node_modules/bootstrap/dist/css')));
app.use('/js',express.static(path.join(__dirname,'./node_modules/bootstrap/dist/js')));
app.use('/jq',express.static(path.join(__dirname,'./node_modules/jquery/dist')));

// EJS
app.set('view engine','ejs');

// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Express Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variable
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.tCode = req.flash('tCode');
    res.locals.marks = req.flash('marks');
    next();
})

// Static path
app.use(express.static(path.join(__dirname,'./public'))); 

// Routes
app.use('/',require('./src/routes/index'));
app.use('/users',require('./src/routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,console.log(`Server running on port ${PORT}`));

