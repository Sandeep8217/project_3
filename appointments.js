const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Book an appointment
router.get('/appointments/book', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.render('appointments/book', { doctors });
    } catch (err) {
        res.status(500).send('Error booking appointment.');
    }
});

module.exports = router;
