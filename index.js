// // routes/index.js or routes/home.js
// const express = require('express');
// const router = express.Router();
// const Doctor = require('../models/doctors');

// router.get('/', async (req, res) => {
//     try {
//         const doctors = await Doctor.find(); // Fetch all doctors from the database
//         res.render('index', { doctors }); // Pass the doctors array to the EJS template
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;
