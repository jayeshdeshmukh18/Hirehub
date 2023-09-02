const express = require('express');
const router = express.Router();
const Job = require('../models/job');

const { checkAdmin, checkLoggedIn } = require('../middlewares/index');

// ===========Render all Questions========================

router.get('/jobs/:id/questions', checkLoggedIn, checkAdmin, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        res.render('questions/index', { job });

    } catch (error) {
        req.flash('error', 'Something went wrong while displaying questions, Please try again.')
        console.log(error);
        res.redirect(`/jobs/${req.params.id}/questions`);
    }
})

//==============Adding a new Question=====================

router.get('/jobs/:id/questions/new', checkLoggedIn, checkAdmin, async (req, res) => {
    res.render('questions/new', { id: req.params.id });
})

router.post('/jobs/:id/questions', checkLoggedIn, checkAdmin, async (req, res) => {
    try {
        const newQuestion = {
            title: req.body.title,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4,
            correctAnswer: req.body.correctAnswer
        };
        const job = await Job.findById(req.params.id);
        job.questions.push(newQuestion);
        await job.save();
        req.flash('success', 'successfully created a new question');
        res.redirect(`/jobs/${req.params.id}/questions`);

    } catch (error) {
        req.flash('error', 'Something went wrong while adding question, Please try again');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}`);
    }
})

//=============Updating a Question==============

router.get('/jobs/:id/questions/:idx/edit', checkLoggedIn, checkAdmin, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (req.params.idx >= job.questions.length) {
            req.flash('error', 'index you are trying to access is not valid')
            return res.redirect(`/jobs/${req.params.id}/questions`);
        }
        const question = job.questions[req.params.idx];
        return res.render('questions/edit', { question, id: req.params.id, idx: req.params.idx });

    } catch (error) {
        req.flash('error', 'Something went wrong while updating question, Please try again');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}/questions`);
    }
});

router.patch('/jobs/:id/questions/:idx', checkLoggedIn, checkAdmin, async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);
        if (req.params.idx >= job.questions.length) {
            req.flash('error', 'index you are trying to access is not valid')
            return res.redirect(`/jobs/${req.params.id}/questions`);
        }

        const updatedQuestion = {
            title: req.body.title,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4,
            correctAnswer: req.body.correctAnswer
        }
        job.questions[req.params.idx] = updatedQuestion;
        await job.save();
        req.flash('success', 'updated the question');
        res.redirect(`/jobs/${req.params.id}/questions`);


    } catch (error) {
        req.flash('error', 'Something went wrong while updating question, Please try again');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}/questions`);
    }
})

//================Delete a Question================

router.delete('/jobs/:id/questions/:idx',checkLoggedIn,checkAdmin,async(req,res)=>{
    try {
        const job= await Job.findById(req.params.id);
        if (req.params.idx >= job.questions.length) {
			req.flash('error', 'index you are trying to access is not valid');
			return res.redirect(`/jobs/${req.params.id}/questions`);
		}
        
       await  job.questions.splice(req.params.idx,1);
       await job.save();
       req.flash('success', 'deleted the question');
	   res.redirect(`/jobs/${req.params.id}/questions`);

        
    } catch (error) {
        req.flash('error','Something went wrong while deleting question, Please try again');
        console.log(error);
        res.redirect(`/jobs/${req.params.id}/questions`)
    }
})
module.exports = router;