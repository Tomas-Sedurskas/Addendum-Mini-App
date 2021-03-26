const router = require('express').Router();
const dateFNS = require('date-fns');
var parseISO = require('date-fns/parseISO')

let Reservation = require('../models/reservation.model');

router.route('/get-reservations').get((req, res) => {
    Reservation.find({
            date: {
                $gte: dateFNS.startOfDay(parseISO(req.query.date)),
                $lte: dateFNS.endOfDay(parseISO(req.query.date))
            }
        }).sort('time')
        .then(reservations => {
            res.send(reservations);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get-patient-reservations').get((req, res) => {
    Reservation.find({firstName: req.query.firstName, lastName: req.query.lastName}).sort('time')
        .then(reservations => {
            res.send(reservations);
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/add-reservation').post((req, res) => {

    const newReservation = new Reservation({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        date: req.body.date,
        time: req.body.time,
        
    });

    newReservation.save();
    res.send("SUCCESS")
});

module.exports = router;