const Job=require('../models/job');
const Notification = require('../models/notification');
const User = require('../models/user')


module.exports.indexJob=async (req, res) => {
	try {
		let pageNo = 1;
		if (req.query.page) pageNo = req.query.page;
		const allJobs = await Job.paginate(
			{},
			{
				page: pageNo,
				limit: 10
			}
		);
		res.render('jobs/index', { allJobs });
	} catch (error) {
		req.flash('error', 'Something went wrong while fetching all jobs, please try again later');
		console.log(error);
		res.redirect('/');
	}
}

module.exports.newJobForm=(req, res) => {
	res.render('jobs/new');
}

module.exports.createJob=async (req, res) => {
	try {
		const newJob = new Job({
			postName: req.body.postName,
			companyName: req.body.companyName,
			ctc: req.body.ctc,
			location: req.body.location,
			cgpa: req.body.cgpa,
			description: req.body.description,
			numberOfPositions: req.body.numberOfPositions
		});
		await newJob.save();
		const newNotif = new Notification({
			title: `New ${newJob.postName} opening`,
			body: `${newJob.companyName} just posted a new job`,
			author: newJob.companyName
		});
		await newNotif.save();
		req.flash('success', 'Successfully posted a job');
		res.redirect('/jobs');
	} catch (error) {
		req.flash('error', 'Something went wrong while creating a job, please try again later');
		console.log(error);
		res.redirect('/jobs');
	}
}

module.exports.showJob=async (req, res) => {
	try {
		const foundJob = await Job.findById(req.params.id);
		res.render('jobs/show', { foundJob });
	} catch (error) {
		req.flash('error', 'Something went wrong while fetching a job, please try again later');
		console.log(error);
		res.redirect('/jobs');
	}
}

module.exports.editJobForm=async (req, res) => {
	try {
		const foundJob = await Job.findById(req.params.id);
		res.render('jobs/edit', { foundJob });
	} catch (error) {
		req.flash('error', 'Something went wrong while fetching a job, please try again later');
		console.log(error);
		res.redirect('/jobs');
	}
}

module.exports.updateJob=async (req, res) => {
	try {
		const jobData = {
			postName: req.body.postName,
			companyName: req.body.companyName,
			ctc: req.body.ctc,
			location: req.body.location,
			cgpa: req.body.cgpa,
			description: req.body.description,
			numberOfPositions: req.body.numberOfPositions
		};
		await Job.findByIdAndUpdate(req.params.id, jobData);
		const newNotif = new Notification({
			title: `${jobData.postName} opening edited`,
			body: `${jobData.companyName} just edit their job`,
			author: jobData.companyName
		});
		await newNotif.save();
		req.flash('success', 'Successfully updated the job');
		res.redirect('/jobs');
	} catch (error) {
		req.flash('error', 'Something went wrong while updating a job, please try again later');
		console.log(error);
		res.redirect('/jobs');
	}
};

module.exports.deleteJob=async (req, res) => {
	try {
		const jobData = await Job.findById(req.params.id);
		await Job.findByIdAndDelete(req.params.id);
		const newNotif = new Notification({
			title: `${jobData.postName} opening deleted`,
			body: `${jobData.companyName} just deleted their job`,
			author: jobData.companyName
		});
		await newNotif.save();
		req.flash('success', 'Successfully deleted the job');
		res.redirect('/jobs');
	} catch (error) {
		req.flash('error', 'Something went wrong while deleting a job, please try again later');
		console.log(error);
		res.redirect('/jobs');
	}
}


module.exports.jobStatus=async (req, res) => {
	try {
		const { type } = req.query,
			{ id } = req.params;
		if (!type) return res.redirect(`/jobs/${id}`);
		if (!['active', 'over', 'interview'].includes(type)) type = 'active';
		const job = await Job.findByIdAndUpdate(id, { status: type });
		req.flash('success', 'status is successfully changed');
		res.redirect(`/jobs/${id}`);
	} catch (error) {
		req.flash('error', 'Something went wrong while changing status of a job, please try again later');
		console.log(error);
		res.redirect('/jobs');
	}
}

module.exports.applyToJob=async (req, res) => {
	try {
		const { id, userId } = req.params;
		const job = await Job.findById(id);
		const user = await User.findById(userId);
		if (user.cgpa < job.cgpa) {
			req.flash('error', 'your cgpa cannot meet the criteria');
			return res.redirect(`/jobs/${id}`);
		}
		const result = hasUserApplied(job, req.user);
		if (result) {
			req.flash('error', 'you can only apply once')
			return res.redirect(`/jobs/${id}`);
		}
		job.appliedUsers.push(user);
		await job.save();
		req.flash('success', 'successfully applied to the job');
		return res.redirect(`/jobs/${id}`);



	} catch (error) {
		req.flash('error', 'something went wrong while applying to a job ,Please try again ')
		console.log(error);
		res.redirect(`/jobs/${req.params.id}`);
	}
}

module.exports.jobTest=async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);
		const result = hasUserApplied(job, req.user);
		if (!result) {
			req.flash('error', 'You need to apply first to the job');
			
			return res.redirect(`jobs/${req.params.id}`);
		}
		return res.render('jobs/test', { job });



	} catch (error) {
		req.flash('error', 'Something went wrong while displaying the test, Please try again.')
		console.log(error);
		res.redirect(`jobs/${req.params.id}`);
	}
};

module.exports.jobTestSubmit= async (req, res) => {
	try {
		console.log(req.body);
		const job = await Job.findById(req.params.id);
		const result = hasUserApplied(job, req.user);
		if (!result) {
			req.flash('error', 'you need to apply first');
			return res.redirect(`/jobs/${req.params.id}`);
		}
        const questions=job.questions;
		let marks=0,
		correct = 0,
		wrong = 0,
		status,
		total = questions.length;

		for(let idx in questions){
			let ques=questions[idx];
			let ans = req.body[`question${idx}`];
			if (ques.correctAnswer === ans) ++marks, ++correct;
			else ++wrong;
		}

		if (marks >= 0.7 * total) status = 'shortlisted';
		else status = 'rejected';
		return res.json({
			marks,
			correct,
			wrong,
			total,
			status
		});


	} catch (error) {
		req.flash('error', 'Something went wrong while displaying the test, please try again later');
		console.log(error);
		return res.redirect(`/jobs/${req.params.id}`);
	}
};

module.exports.searchJob=async (req,res)=>{
	try {
		const name=req.query.name;
		if(!name){
		 return res.redirect('/jobs');
		}
		const regex = new RegExp(escapeRegex(name));
		const jobs = await Job.find({ companyName: regex });
		res.render('jobs/search', { jobs });
 
	 
	} catch (error) {
		 req.flash('error','Something went wrong while searching for a job. Please try again')
		 console.log(error);
		 res.redirect('/jobs');
	}
 };

const hasUserApplied = (job, user) => {
	let flag = false;
	for (let ids of job.appliedUsers) {
		if (ids.equals(user._id)) flag = true;
	}
	return flag;
};

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
