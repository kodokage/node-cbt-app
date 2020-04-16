//Ensure pages can only be viewed when user is logged in

module.exports = {
    ensureAuthenticated:function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Not authorized');
        res.redirect('/users/login');
    }
}