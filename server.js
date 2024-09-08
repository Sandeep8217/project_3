const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');

const session = require('express-session');
const router = require('./routes');
// const doctors = require('./models/doctors');
// const routers = express.Router();

// routers.get('/', async (req, res) => {
//     try {
//         const doctors = await doctors.find(); // Fetch all doctors from the database
//         res.render('index', { doctors }); // Pass the doctors array to the EJS template
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });
// module.exports=router;

// const expressLayouts = require('express-ejs-layouts');

const app = express();

// Flash setup

// Middleware
// app.use(express.urlencoded({ extended: true }));
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'view')));
app.set('view engine', 'ejs');

// app.js or server.js
app.use('/images', express.static('images'));

// Routes
// app.use(expressLayouts);
app.use(authRoutes);
app.use('/admin',adminRoutes);
app.use('/user',userRoutes);
app.use(appointmentRoutes);
app.use(doctorRoutes);


// app.js or server.js
app.use('/images', express.static('path/to/your/images/directory'));



// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hospital-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB.');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/',(req,res) => {
 res.render('index');
});
// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
