const express = require('express');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { Booking } = require('../../db/models');

const validateBooking

router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id

    const bookings = await Booking.findAll({
        where: {
            userId: userId
        }
    })

    res.json(bookings)
})



module.exports = router;