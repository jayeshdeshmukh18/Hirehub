
const checkLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else {
        req.flash('error',"You need to signed to do that");
        res.redirect('/login');
    }
};

const checkAdmin=(req,res,next)=>{
    if(req.user.isAdmin)next();
    else{
        req.flash('error',"You are not authorized to do that");
        res.redirect('back');
    }
}

const verifyUser=(req,res,next)=>{
    if(req.user.isAdmin || req.user._id.equals(req.params.id))next();
    else{
        req.flash('error,"You are not permitted to do that task');
        res.redirect('back');
    }
};

module.exports = {checkLoggedIn,checkAdmin,verifyUser};