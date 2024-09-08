// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
