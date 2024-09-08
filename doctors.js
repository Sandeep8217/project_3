// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true } // URL or path to the doctor's photo
});

const doctors = mongoose.model('doctors', doctorSchema);

module.exports = doctors;
