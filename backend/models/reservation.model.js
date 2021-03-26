const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reservationSchema = new Schema ({
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;