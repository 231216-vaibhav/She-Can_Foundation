const Submission = require('../models/Submission');

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Public
const createSubmission = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        const newSubmission = await Submission.create({
            name,
            email,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Submission successfully received!',
            data: newSubmission
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all submissions (with search, sorting, and metadata)
// @route   GET /api/submissions
// @access  Public (Should be private in production, but public for admin dashboard access in this layout)
const getSubmissions = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};

        // If search term is provided, filter by name OR email (case-insensitive)
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query = {
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            };
        }

        // Fetch submissions, sorted descending by date (latest first)
        const submissions = await Submission.find(query).sort({ createdAt: -1 });
        const totalSubmissions = await Submission.countDocuments(); // Overall total count
        const filteredCount = submissions.length; // Filtered match count

        res.status(200).json({
            success: true,
            total: totalSubmissions,
            filteredCount,
            data: submissions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a submission by ID
// @route   DELETE /api/submissions/:id
// @access  Public
const deleteSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findById(id);

        if (!submission) {
            res.status(404);
            throw new Error('Submission not found');
        }

        await submission.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Submission deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSubmission,
    getSubmissions,
    deleteSubmission
};
