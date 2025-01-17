const router = require('express').Router();
const User  = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res) => {
    
    // validate
    const { error } = registerValidation(req.body);
    console.log(error)
    // if validation fails return error.
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // check if user is there in db

    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
        return res.status(400).send("Email already registered")
    }
    
    //encrpt the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    })

    try {
        const savedUser = await user.save();
        res.send({user: savedUser._id})
    } catch(err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).send("Email does not exists")
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send("Invalid Password");
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);

})

module.exports = router;