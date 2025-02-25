import express from 'express';
import auth from '../../middleware/auth.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import User from '../../models/User.mjs';
const router = express.Router();

// @route:   GET /api/auth
// @desc:    Authenticate User
// @access:  Private Route/Routes that you should be signed in to access
router.get('/', auth , async (req, res) => {
    try {
        // Get user info from DB using user ID from req.user
        const user = await User.findById(req.user.id).select('-password');

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{msg: 'Server Error' }] });
    }
});

router.post(
    '/',
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', ' Password required').not().isEmpty(),
    ],
    async (req, res) => {
      // Check if any validation errors in the req obj
      let errors = validationResult(req);
  
      // If the errors variable is NOT empty, response with errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // Desctructure our req.body
      const { email, password } = req.body;
  
      try {
        // Find a user and check if they exist
        let user = await User.findOne({ email });
  
        // if user does NOT exists, return error
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        // Check if passwords match
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        // create a payload
        const payload = {
          user: {
            id: user.id,
          },
        };
  
        // Sign and send a jwt back to the frontend
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
  
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
      }
    }
  );
  
  export default router;
  
  
  
  
  
  
  






















// @route:   POST /api/auth
// @desc:    Login User Route
// @access:  Public Route
// router.post('/', [
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Password is required').not().isEmpty
// ], 
// async (req, res)=>{
//      // Check if any validation errors in the req obj
//      const errors = validationResult(req);

//      // If the errors variable is NOT empty, response with errors
//      if (!errors.isEmpty()) {
//        return res.status(400).json({ errors: errors.array() });
//      }

//     //  Destructure my req.body
//     const { email, password } = req.body;

//     try {
//         // Check if user already exists
//         const user = await User.findOne({email});

//         //  If user doesn't exist, respond with error
//         if (!user) {
//             return res
//             .status(400)
//             .json({ errors: [{ msg: 'Invalid Credentials' }] });
//         }

//         // Check if password is correct
//         const isMatch = await bcrypt.compare(password, user.password);

//         //  If password is incorrect, respond with error
//         if (!isMatch) {
//             return res
//             .status(400)
//             .json({ errors: [{ msg: 'Invalid Credentials' }] });
//         }

//         // Create JWT Payload
//         const payload = {
//             user: {
//                 id: user.id
//             }
//         };

//         // Sign the token. If there are no errors, send the token to the frontend
//         jwt.sign(
//             payload, 
//             process.env.JWT_SECRET, {
//             expiresIn: 360000
//         }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ errors: [{msg: 'Server Error' }] });
//     }


// })





// export default router;
