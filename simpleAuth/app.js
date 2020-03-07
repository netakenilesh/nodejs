const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const passport = require('passport')

require('./config/passport')(passport);
// db config
const db = require('./config/keys');

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Mongodb connected"))
.catch(err => console.log(err))

const PORT = process.env.PORT || 5000;

// EJS
app.use(expressLayouts);
app.set('view engine' , 'ejs');

// body parser
app.use(express.urlencoded({extended: false}))

// express session
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  // flash
app.use(flash());

// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))

app.listen(PORT, console.log(`Server start on port ${PORT}`))