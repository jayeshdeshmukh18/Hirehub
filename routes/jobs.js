const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const Notification = require('../models/notification');
const User = require('../models/user')

// !Controllers
const jobController=require('../controllers/job')

// ! MIDDLEWARES
const { checkLoggedIn, checkAdmin } = require('../middlewares/index');

//========Searching================


// ! INDEX ROUTE
router.get('/jobs', jobController.indexJob);

//==============Search Routes================
router.get('/jobs/search',jobController.searchJob)

// ! NEW ROUTE
router.get('/jobs/new', checkLoggedIn, checkAdmin,jobController.newJobForm );

// ! CREATE ROUTE
router.post('/jobs', checkLoggedIn, checkAdmin,jobController.createJob );

// ! SHOW ROUTE
router.get('/jobs/:id', jobController.showJob);

// ! EDIT ROUTE
router.get('/jobs/:id/edit', checkLoggedIn, checkAdmin, jobController.editJobForm);

// ! UPDATE ROUTE
router.patch('/jobs/:id', checkLoggedIn, checkAdmin, jobController.updateJob);

// ! DELETE ROUTE
router.delete('/jobs/:id', checkLoggedIn, checkAdmin, jobController.deleteJob);

// ! changing job status
router.get('/jobs/:id/status', checkLoggedIn, checkAdmin, jobController.jobStatus);


//! apply to job

router.get('/jobs/:id/apply/:userId', checkLoggedIn, jobController.applyToJob)

//=================Test of a Job================

router.get('/jobs/:id/test', checkLoggedIn, jobController.jobTest)

router.post('/jobs/:id/test', checkLoggedIn,jobController.jobTestSubmit)



module.exports = router;