import express from 'express';
import { check, validationResult } from 'express-validator';
import Vehicle from '../../models/Vehicles.mjs';
import auth from '../../middleware/auth.mjs';
import User from '../../models/User.mjs';

const router = express.Router();

// @route:   GET /api/vehicles
// @desc:    Get all vehicles for a user
// @access:  Private Route
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

router.get('/:userid', async (req, res) => {
    try {
        console.log(req.params.userid)
        const user = await User.findById(req.params.userid);
        console.log(user)
        const vehicles = await Vehicle.find({ owner: user._id });
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: 'Server Error || Vehicle Not Found' }] });
    }
});




// @route:   POST /api/vehicles
// @desc:    Create a new vehicle
// @access:  Private Route
router.post(
    '/',
    [
        
        [
            check('make', 'Make is required').not().isEmpty(),
            check('model', 'Model is required').not().isEmpty(),
            check('year', 'Year is required').not().isEmpty(),
            check('color', 'Color is required').not().isEmpty(),
            check('mileage', 'Mileage is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newVehicle = await Vehicle.create(req.body);

            res.json(newVehicle);
        } catch (error) {
            console.error(error);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);


router.put('/:vehicleid', async (req, res) => {
    const updated = await Vehicle.findByIdAndUpdate(req.params.vehicleid, req.body, {
        new: true
    });
    res.json(updated);
});




router.delete('/:vehicleid', async (req, res) => {
    try {
        const deleted = await Vehicle.findByIdAndDelete(req.params.vehicleid);
        

        if (!deleted) {
            return res.status(404).json({ errors: [{ msg: 'No Vehicle Found In This Lot'}]})
        }

        res.json(deleted).sendStatus(200).alert('Vehicle Deleted');
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
})




export default router;

