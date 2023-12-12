const express = require('express');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { Booking, Spot, SpotImage, Image } = require('../../db/models');
const { Op } = require('sequelize')

const validateBooking = []

router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({ 
      where: { userId },
      include: {
        model: Spot,
        as: 'Spot',
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price',],
      },
    });
  
    const Bookings = await Promise.all(bookings.map( async (booking) => {
      const spot = { ...booking.Spot.get() };
      const previewImage = await SpotImage.findOne({
        where: { spotId: spot.id, preview: true },
      });
  
      if (previewImage) {
        spot.previewImage = previewImage.url;
      }
  
      return {
        id: booking.id,
        spotId: booking.spotId,
        Spot: spot,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }
    }));
    
    return res.status(200).json({ Bookings });
});


router.put('/:bookingId', requireAuth, validateBooking, async(req, res, next) => {
    const {bookingId} = req.params
        const {startDate, endDate} = req.body
        const {user} = req
        const booking = await Booking.findByPk(bookingId)
        if (!booking) {
            const err = new Error("Booking couldn't be found");
            err.status = 404;
            return next(err);
        }

        if (booking.userId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
          }

        if (new Date(booking.endDate) < new Date()) {
            const err = new Error("Past bookings can't be modified");
            err.status = 403;
            return next(err);
        }

        const bookedDates = await Booking.findAll(
            {
                where: {
                    spotId: booking.spotId,
                    id: {
                      [Op.not]: bookingId
                    }
                  }
        }
        )
        if(bookedDates.length) {
            if(endDate > startDate){
                for (let booking of bookedDates) {
                    const start_exist = new Date(booking.startDate);
                    const end_exist = new Date(booking.endDate);
                    const start = new Date(startDate)
                    const end = new Date(endDate);
                    if(start_exist <= start && end_exist>= end) {
                        const err = new Error("Sorry, this spot is already booked for the specified dates");
                        err.status = 403;
                        return next(err);
                    }
                    if (start >= start_exist && start <= end_exist) {
                        const err = new Error("Sorry, this spot is already booked for the specified dates");
                        err.status = 403;
                        err.errors = {}
                        err.errors.startDate = "Start date conflicts with an existing booking"
                        return next(err);
                        }

                        if (end >= start_exist && end <= end_exist) {
                        const err = new Error("Sorry, this spot is already booked for the specified dates");
                        err.status = 403;
                        err.errors = {}
                        err.errors.endDate = "End date conflicts with an existing booking"
                        return next(err);
                        }
                        //dates surrond existing boooking
                        if(start<= start_exist && end >= end_exist) {
                            const err = new Error("Sorry, this spot is already booked for the specified dates");
                            err.status = 403;
                            return next(err);
                        }
                }
        }
            else{
                const err = new Error("Bad Request");
            err.status = 403;
            err.errors = {}
            err.errors.endDate = "endDate cannot be on or before startDate"
            return next(err);
            }
       }
       if(endDate <= startDate) {
            const err = new Error("Bad Request");
            err.status = 403;
            err.errors = {}
            err.errors.endDate = "endDate cannot be on or before startDate"
            return next(err);
        }

        const updatedbooking = await booking.update(req.body);
        return res.json(updatedbooking)
    });

    router.delete("/:bookingId",requireAuth, async (req, res, next) => {
        const bookingId = req.params.bookingId
        const { user } = req
        const booking = await Booking.findByPk(bookingId,
            {include: {
                model: Spot,
                attributes: ["ownerId"]
            }})
    
        if (!booking) {
            const err = new Error("Booking couldn't be found");
            err.status = 404;
            return next(err);
        }
    
        if ( booking.userId !== user.id ) {
            if (booking.Spot.ownerId !== user.id){
                const err = new Error("Forbidden");
                err.status = 403;
                return next(err);
            }
            }
    
            if (new Date(booking.startDate) < new Date()) {
                const err = new Error("Bookings that have been started can't be deleted");
                err.status = 403;
                return next(err);
            }
    
            await booking.destroy();
            return res.json({
                "message": "Successfully deleted"
              })
        })


module.exports = router;