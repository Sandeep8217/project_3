const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const User = require('../models/User');
const { Error } = require('mongoose');

// Admin Dashboard Route
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

// View all appointments
// router.get('/appointments', async (req, res) => {
//     try {
//         // const appointments = await Appointment.find().populate('userId').populate('doctorId');
//         // const appointments = await Appointment.find({ user: User }).populate('doctor');
//         const appointments = await Appointment.find({ user: req.session.userId })
//                                       .populate('doctor')
//                                       .populate('user'); // Populate user details


//         res.render('admin/appointments', { appointments });
//     } catch (err) {
//         console.error('Error retrieving appointments:', err.message, err.stack);

//         res.status(500).send('Error retrieving appointments.');
//     }
// });
// routes/admin.js

// View all appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('userId', 'username') // Populate with user information
            .populate('doctorId', 'name');  // Populate with doctor information

        res.render('admin/appointments', { appointments });
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).send('Error retrieving appointments');
    }
});


// Set appointment status
// router.post('/admin/appointments/status', async (req, res) => {
//     const { appointmentId, status } = req.body;
//     try {
//         await Appointment.findByIdAndUpdate(appointmentId, { status });
//         res.redirect('/admin/appointments');
//     } catch (err) {
//         res.status(500).send('Error updating appointment status.');
//     }
// });

router.post('/appointments/:id/status', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const newStatus = req.body.status;

        // Find the appointment by ID and update its status
        await Appointment.findByIdAndUpdate(appointmentId, { status: newStatus });

        // Redirect back to the view appointments page
        res.redirect('/admin/appointments');
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).send('Error updating appointment status');
    }
});

// View all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.render('admin/doctors', { doctors });
    } catch (err) {
        res.status(500).send('Error retrieving doctors.');
    }
});
//route to add dcotors

    router.get('/doctors/add',(req,res) => {
        res.render('admin/addDoctor');
    });

// Add a doctor
router.post('/addDoctor', async (req, res) => {
   
    const { name, specialty } = req.body;
    try {
        const newDoctor = new Doctor({ name, specialty });
        await newDoctor.save();
        res.redirect('/admin/doctors');
    } catch (err) {
        res.status(500).send('Error adding doctor.');
    }
});

// Route to render Add Admin form
router.get('/admins/add', async (req, res) => {
    res.render('admin/admins'); // Make sure this view exists
});

// Route to handle adding a new admin
// router.post('/admins/add', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const newAdmin = new User({ username, email, password, isAdmin: true });
//         await newAdmin.save();
//         res.redirect('/admin/addAdmin'); // Redirect to view admins page
//     } catch (error) {
//         console.error('Error adding admin:', error);
//         res.status(500).send('Error adding admin');
//     }
// });

// Route to handle adding a new admin
router.post('/admins/add', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newAdmin = new User({ username, email, password, isAdmin: true });
        await newAdmin.save();
        res.send('admin added successfully');
       // res.redirect('/viewadmins'); // Redirect to view admins page after successful addition
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).send('Error adding admin');
    }
});

// Route to view all admins
router.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({ isAdmin: true }); // Fetch all admins from the database
        res.render('admin/viewadmins', { admins });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).send('Error fetching admins');
    }
});

// View all messages
// router.get('/messages', async (req, res) => {
//     try {
//         const messages = await Message.find().populate('userId').populate(Doctor);
//         res.render('admin/messages', { messages });
//     } catch (err) {
//         res.status(500).send('Error retrieving messages.');
//     }
// });
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().populate('sender').populate('recipient');
        res.render('admin/messages', { messages });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Error retrieving messages');
    }
});


router.get('/dashboard', (req, res) => {
    res.render('adminDashboard');
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/views/index');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
});
// Route to show the reply form
router.get('/replyMessage/:messageId', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId).populate('sender').exec();
        if (!message) {
            return res.status(404).send('Message not found');
        }

        res.render('admin/replyMessage', { message });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).send('Server Error');
    }
});

// Route to handle the reply submission
// router.post('/replyMessage/:messageId', async (req, res) => {
//     try {
//         const { subject, body } = req.body;
//         const originalMessage = await Message.findById(req.params.messageId).populate('sender').exec();

//         if (!originalMessage) {
//             return res.status(404).send('Original message not found');
//         }

//         const replyMessage = new Message({
//             sender: req.session.userId, // Admin's user ID
//             recipient: originalMessage.sender._id, // Original sender's ID
//             subject: `Re: ${subject || originalMessage.subject}`,
//             body,
//             dateSent: new Date()
//         });

//         await replyMessage.save();
//         res.redirect('/admin/messages');
//     } catch (error) {
//         console.error('Error sending reply:', error);
//         res.status(500).send('Error sending reply');
//     }
// });
// router.post('/replyMessage/:messageId', async (req, res) => {
//     try {
//         const { subject, body } = req.body;
//         console.log('Received data:', { subject, body });

//         const originalMessage = await Message.findById(req.params.messageId).populate('sender').exec();
//         console.log('Original message:', originalMessage);

//         if (!originalMessage) {
//             return res.status(404).send('Original message not found');
//         }

//         const replyMessage = new Message({
//             sender: req.session.userId,
//             recipient: originalMessage.sender._id,
//             subject: `Re: ${subject || originalMessage.subject}`,
//             body,
//             dateSent: new Date()
//         });

//         await replyMessage.save();
//         res.redirect('/admin/messages');
//     } catch (error) {
//         console.error('Error sending reply:', error);
//         res.status(500).send('Error sending reply');
//     }
// });
// router.get('/replyMessage/:messageId', async (req, res) => {
//     try {
//         const { recipientId, subject, body } = req.body;
        
//         // Check if the user ID is set in the session
//         console.log('User ID from session:', req.session.userId);

//         if (!req.session.userId) {
//             return res.status(401).send('User not logged in or session expired');
//         }

//         const newMessage = new Message({
//             sender: req.session.userId, // Ensure this is populated correctly
//             recipient: recipientId,
//             subject,
//             body,
//             dateSent: new Date()
//         });

//         await newMessage.save();
//         res.redirect('/user/messages');
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).send('Error sending message');
//     }
// });
// Route to handle replying to a message
// router.post('/replyMessage/:messageId', async (req, res) => {
//     try {
//         const { messageId } = req.params;
//         const { body } = req.body;

//         // Ensure the admin is logged in
//         // if (!req.session.userId) {
//         //     return res.status(401).send('Admin not logged in or session expired');
//         // }

//         // Find the original message
//         const originalMessage = await Message.findById(messageId);
//         if (!originalMessage) {
//             return res.status(404).send('Message not found');
//         }

//         // Create a new reply message
//         const replyMessage = new Message({
//             sender: req.session.userId, // Admin sending the reply
//             recipient: originalMessage.sender, // Replying to the original sender
//             subject: `Re: ${originalMessage.subject}`, // Adding "Re:" prefix to subject
//             body, // Reply message body
//             dateSent: new Date()
//         });

//         await replyMessage.save();
//         res.redirect('/admin/messages'); // Redirect to admin messages page after sending the reply
//     } catch (error) {
//         console.error('Error sending reply:', error);
//         res.status(500).send('Error sending reply');
//     }
// });

// Route to handle replying to a message
// router.post('/replyMessage/:messageId', async (req, res) => {
//     try {
//         const { messageId } = req.params;
//         const { body } = req.body; // Assuming 'body' is the name of the textarea in your form

//         // Ensure the admin is logged in
//         if (!req.session.userId) {
//             return res.status(401).send('Admin not logged in or session expired');
//         }

//         // Find the original message
//         const originalMessage = await Message.findById(messageId);
//         if (!originalMessage) {
//             return res.status(404).send('Message not found');
//         }

//         // Create a new reply message
//         const replyMessage = new Message({
//             sender: req.session.userId, // Admin sending the reply
//             recipient: originalMessage.sender, // Replying to the original sender
//             subject: `Re: ${originalMessage.subject}`, // Adding "Re:" prefix to subject
//             body, // Reply message body
//             dateSent: new Date()
//         });

//         await replyMessage.save();
//         res.redirect('/admin/messages'); // Redirect to admin messages page after sending the reply
//     } catch (error) {
//         console.error('Error sending reply:', error);
//         res.status(500).send('Error sending reply');
//     }
// });

// router.post('/replyMessage/:messageId', async (req, res) => {
//     try {
//         const { message } = req.body; // Get the message from the form
//         const { messageId } = req.params; // Get the original message ID from the URL

//         // Ensure the admin is logged in
//         if (!req.session.userId || !req.session.isAdmin) {
//             return res.status(401).send('Admin not logged in or session expired');
//         }
//          // Fetch the original message from the database
//          const originalMessage = await Message.findById(messageId);
//          if (!originalMessage) {
//              return res.status(404).send('Original message not found');
//          }
 
//          // Ensure the reply message is not empty
//          if (!message || message.trim() === '') {
//              return res.status(400).send('Reply message cannot be empty');
//          }

//         const replyMessage = new Message({
//             sender: req.session.userId, // Set the sender as the logged-in admin
//             recipient: originalMessage.sender, // Set the recipient as the original message sender
//             subject: `Re: ${originalMessage.subject}`, // Prefix the subject with "Re:"
//             body: message, // Use the message from the form
//             dateSent: new Date(),
//             replyTo: messageId, // Reference the original message
//         });

//         await replyMessage.save(); // Save the reply

//         res.redirect('/admin/messages'); // Redirect to the admin messages page
//     } catch (error) {
//         console.error('Error sending reply:', Error);
//         res.status(500).send('Error sending reply');
//     }
// });

// router.post('/replyMessage/:messageId', async (req, res) => {
//     try {
//         const { message } = req.body; // Ensure this matches your form's name attribute
//         const { messageId } = req.params; // Get the original message ID from the URL

//         // Ensure the admin is logged in
//         if (!req.session.userId || !req.session.isAdmin) {
//             return res.status(401).send('Admin not logged in or session expired');
//         }

//         // Fetch the original message from the database
//         const originalMessage = await Message.findById(messageId);
//         if (!originalMessage) {
//             return res.status(404).send('Original message not found');
//         }

//         // Ensure the reply message is not empty
//         if (!message || message.trim() === '') {
//             return res.status(400).send('Reply message cannot be empty');
//         }

//         // Create the reply message
//         const replyMessage = new Message({
//             sender: req.session.userId, // Set the sender as the logged-in admin
//             recipient: originalMessage.sender, // Set the recipient as the original message sender
//             subject: `Re: ${originalMessage.subject}`, // Prefix the subject with "Re:"
//             body: message, // Use the message from the form
//             dateSent: new Date(),
//             replyTo: messageId, // Reference the original message
//         });

//         await replyMessage.save(); // Save the reply

//         res.redirect('/admin/messages'); // Redirect to the admin messages page
//     } catch (error) {
//         console.error('Error sending reply:', Error);
//         res.status(500).send('Error sending reply');
//     }
// });

router.post('/replyMessage/:messageId', async (req, res) => {
    try {
        const { subject, body } = req.body; // Use 'body' to get the message content
        const { messageId } = req.params;
        console.log('Form Data:', req.body);

        // Ensure the admin is logged in
        if (!req.session.userId || !req.session.isAdmin) {
            return res.status(401).send('Admin not logged in or session expired');
        }

        // Fetch the original message
        const originalMessage = await Message.findById(messageId);
        if (!originalMessage) {
            return res.status(404).send('Original message not found');
        }

        // Create a new reply message
        const replyMessage = new Message({
            sender: req.session.userId,
            recipient: originalMessage.sender,
            subject: subject || `Re: ${originalMessage.subject}`,
            body, // Use the 'body' variable from req.body
            dateSent: new Date(),
        });

        await replyMessage.save();
        // res.redirect('/admin/messages');
        res.send('replyed to user sucessfully');
        res.render('admin/dashboard');
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).send('Error sending reply');
    }
});


module.exports = router;
