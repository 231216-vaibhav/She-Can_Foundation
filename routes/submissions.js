const express = require('express');
const router = express.Router();
const { 
    createSubmission, 
    getSubmissions, 
    deleteSubmission 
} = require('../controllers/submissionsController');
const { validateSubmission } = require('../middleware/validation');

// Define REST API routes for submissions
router.route('/')
    .post(validateSubmission, createSubmission)
    .get(getSubmissions);

router.route('/:id')
    .delete(deleteSubmission);

module.exports = router;
