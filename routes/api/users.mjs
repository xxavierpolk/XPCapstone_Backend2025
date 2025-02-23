import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../../models/User.mjs';

const router = express.Router();

// @route:   POST api/users
// @desc:    Register User Route
// @access:  Public

// Creating a new user with validation
router.post('/', [
    check ('name', 'Name is required').not().isEmpty(),
    check ('email', 'Please include a valid email').isEmail(),
    check ('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], async (req, res) => {
    // Check for any validation errors in the request object
    // creates an array of errors and checking the request 
    const errors = validationResult(req);

    // If the errors variables is NOT empty, response with errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request body / req.body
    const { name, email, password } = req.body;

    try {
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
    

});

export default router;
