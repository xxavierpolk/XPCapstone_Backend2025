import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    // condition: {
    //     type: String,
    //     required: true,
    // },
    // engine: {
    //     type: String,
    //     required: true,
    // },
    // maintenance: {
    //     type: String,
    //     required: true,
    // },
});

const Vehicle = mongoose.model('vehicle', VehicleSchema);

export default Vehicle;