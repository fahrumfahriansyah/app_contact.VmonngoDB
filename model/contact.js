const mongoose = require('mongoose');
//! konfigurasi data
const contact = mongoose.model('Contact', {
    nama: {
        type: String,
        required: true
    },
    noHP: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
})
module.exports = { contact }