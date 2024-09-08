// // models/Appointment.js
// const mongoose = require('mongoose');

// const appointmentSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
//     date: { type: Date, required: true },
//     time: { type: String, required: true },
//     status: { type: String, default: 'pending' }  // Default status is pending
// });

// const Appointment = mongoose.model('Appointment', appointmentSchema);
// module.exports = Appointment;

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;


