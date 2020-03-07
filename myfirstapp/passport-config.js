const LocalStratergy  = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
function initialize(passport, getUserByEmail) {
     const authenticateUser = async (email, password, done) => {
        console.log('in authenticate user');
        const user = getUserByEmail(email);
        console.log("user comparision=", user);
        if (user == null) {
            return done(null, false, {message: "User does not exists with that email"})
        }

        try{
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }
            else{
                return done(null, false, {message: "Incorrect Password"})
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStratergy({usernameField: 'email', passwordField: 'password'}, authenticateUser));

    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})
}

module.exports = initialize;