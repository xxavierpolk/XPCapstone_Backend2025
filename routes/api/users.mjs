import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../../models/User.mjs';

const router = express.Router();

// @route:   POST api/users
// @desc:    Register User Route
// @access:  Public
router.post('/', async (req, res) => res.send('User Route'));

export default router;
