import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import User from '../../models/User.mjs';

const router = express.Router();

// @route:   POST /api/users
// @desc:    Register User Route
// @access:  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check if any validation errors in the req obj
    const errors = validationResult(req);

    // If the errors variable is NOT empty, response with errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure my req.body
    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      //   If user exists already, respond with error
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exists' }] });
      }

      // Create a new user
      user = new User({
        name,
        email,
        password,
      });

      // Encrypt password
      // Create a salt - number of encryption rounds it goes through
      const salt = await bcrypt.genSalt(10);
      // Hash password using salt
      user.password = await bcrypt.hash(password, salt);

      //   Save user to DB
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      //   Create a jwt, sign it, if there are no errors, send token to the FE
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600000 }, //Expiration date/time/options obj
        (err, token) => {
          // If error, throw error
          if (err) throw err;

          res.status(201).json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
  }
);

export default router;










// import express from 'express';
// import bcryptjs from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { check, validationResult } from 'express-validator';
// import User from '../../models/User.mjs';

// const router = express.Router();

// // @route:   POST api/users
// // @desc:    Register User Route
// // @access:  Public

// // Creating a new user with validation
// router.post('/', [
//     check ('name', 'Name is required').not().isEmpty(),
//     check ('email', 'Please include a valid email').isEmail(),
//     check ('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
// ], async (req, res) => {
//     // Check for any validation errors in the request object
//     // creates an array of errors and checking the request 
//     const errors = validationResult(req);

//     // If the errors variables is NOT empty, response with errors
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     // Destructure the request body / req.body
//     const { name, email, password } = req.body;

//     try {
//         // Check if the user already exists
//         const user = await User.findOne({ email });

//         // If the user exists, response with an error
//         if (user) {
//             return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//         }

//         // Create a new user
//         const newUser = new User({
//             name,
//             email,
//             password,
//         });

//         // Encrypt the password
//             // Create a salt - number of encryption rounds
//          const salt = await bcryptjs.genSalt(10);

//             // Hash the password using the salt
//         newUser.password = await bcryptjs.hash(password, salt);

//         // Save the user to the database
//         await newUser.save();

//         // Return the jsonwebtoken
//         const payload = {
//             user: {
//                 id: newUser.id,
               
//             },
//         };
//         // Sign the token. If there are no errors, send the token to the frontend
//         jwt.sign(
//             payload, 
//             process.env.JWT_SECRET, {
//             expiresIn: 360000, // Expiration date/time
//         }, (err, token) => {
//             // If there is an error, throw the error
//             if (err) throw err; 

//             res.status(200).json({ token });
//         });


//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ errors: [{ msg: 'Server Error' }] });
//     }
    

// });

// export default router;
