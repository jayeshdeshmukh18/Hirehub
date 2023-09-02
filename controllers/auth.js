const User=require('../models/user');
const passport=require('passport');

exports.loginForm=(req,res)=>{
    res.render('users/login');
}

exports.loginLogic = (req, res) => {
	req.flash('success', 'Welcome back user');
	res.redirect('/jobs');
};

exports.registerForm = (req, res) => {
	res.render('users/signup');
};

exports.registerLogic=async (req,res)=>{
   
    try {
        const newUser=new User({
            username:req.body.username,
            cgpa: req.body.cgpa,
			gender: req.body.gender,
			phone: req.body.phone,
			dob: req.body.dob
        })
        let registerUser= await User.register(newUser,req.body.password);
        req.login(registerUser,(error)=>{
            if(error)res.send(error);
            res.redirect('/jobs');
        })

    } catch (error) {
        if(error){
            res.send(error);
        }
    }

}

exports.logoutUser = (req, res) => {
	req.logout(function(error) {
		if (error) {
			req.flash('error', 'Something went wrong while logging you out, please try again later');
			console.log(error);
			res.redirect('/jobs');
		}
		req.flash('success', 'Successfully logged out');
		res.redirect('/jobs');
	});
};