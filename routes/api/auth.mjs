import express from 'express';
import authMidWare from '../../middleware/auth.mjs';
import Users from '../../models/User.mjs';
import User from '../../models/User.mjs';
const router = express.Router();

// @route:   GET /api/auth
// @desc:    Authenticate User
// @access:  Private Route
router.get('/', authMidWare , async (req, res) => {
    try {
        // Get user info from DB using user ID from req.user
        const user = await User.findById(req.user.id)
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{msg: 'Server Error' }] });
    }
});

export default router;
