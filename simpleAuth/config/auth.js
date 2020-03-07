module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            console.log(req);
            console.log("authenticated")
            return next();
        }

        req.flash('error', 'Please log in');
        res.redirect('user/login')

    }
}