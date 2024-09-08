const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/hospital-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const createAdmin = async () => {
    try {
        const admin = new User({
            username: 'Admin',
            email: 'admin@example.com',
            password: 'adminpassword',
            isAdmin: true
        });
        await admin.save();
        console.log('Admin user created successfully.');
    } catch (err) {
        console.error('Error creating admin user:', err);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
