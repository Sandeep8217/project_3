// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    dateSent: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
