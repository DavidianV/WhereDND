const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const booking = require('../../db/models/booking');


const calculateAvgRating = async spotId => {
    const reviews = await Review.findAll({ 
        where: {
        spotId: spotId,
    }});
    const reviewCount = reviews.length;

    let sum = 0;
    reviews.forEach(review => {
        sum+= review.stars;
    });

    return sum / reviewCount;
};

const calculateNumReviews = async spotId => {
    const reviews = await Review.findAll({ 
        where: {
            spotId: spotId,
        }});
       return reviews.length;
};


const validateSpot = [
    check('address')
    .exists({checkFalsy: true})
    .withMessage('Street address is required'),
    check('city')
    .exists({checkFalsy: true})
    .withMessage('City is required'),
    check('state')
    .exists({checkFalsy: true})
    .withMessage('State is required'),
    check('country')
    .exists({checkFalsy: true})
    .withMessage('Country is required'),
    check("lat")
        .exists({ checkFalsy: true })
        .isDecimal()
        .custom(lat => lat >= -90 && lat <= 90)
        .withMessage("Latitude must be within -90 and 90"),
    check("lng")
        .exists({ checkFalsy: true })
        .isDecimal()
        .custom(lng => lng >= -180 && lng <= 180)
        .withMessage("Longitude must be within -180 and 180"),
        check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60})
        .withMessage("Name must be less than 50 characters"),
        check('description')
        .exists({checkFalsy: true})
        .withMessage('Description is required'),
        check('price')
        .custom(price => price > 0)
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
]

const validateReview = [
check('review')
.exists({checkFalsy: true})
.withMessage('Review text is required'),
check('stars')
.toInt()
.custom(async stars => {
    if(stars > 5 || stars < 0) {
        throw new Error("Stars must be an integer from 1 to 5")
    }
}),
handleValidationErrors
]

const validateParams= [
    check("page")
      .optional()
      .isInt()
      .withMessage("Page must be greater than or equal to 1")
      .custom(value => ((value >= 1 ) && (value <= 10)))
      .withMessage("Page must be greater than or equal to 1"),
    check("size")
      .optional()
      .isInt()
      .withMessage("Page must be greater than or equal to 1")
      .custom(value => ((value >= 1 ) && (value <= 20)))
      .withMessage("Size must be greater than or equal to 1"),
    check("minLat")
      .optional()
      .isDecimal()
      .withMessage("Minimum latitude is invalid")
      .custom(value => ((value >= -90) && (value <= 90)))
      .withMessage("Minimum latitude is invalid"),
    check("maxLat")
      .optional()
      .isDecimal()
      .withMessage("Maximum latitude is invalid")
      .custom(value => ((value >= -90) && (value <= 90)))
      .withMessage("Maximum latitude is invalid"),
    check("minLng")
      .optional()
      .isDecimal()
      .withMessage("Minimum longitude is invalid")
      .custom(value => ((value >= -180) && (value <= 180)))
      .withMessage("Minimum longitude is invalid"),
    check("maxLng")
      .optional()
      .isDecimal()
      .withMessage("Maximum longitude is invalid")
      .custom(value => ((value >= -180) && (value <= 180)))
      .withMessage("Maximum longitude is invalid"),
    check("minPrice")
      .optional()
      .isDecimal()
      .withMessage("Maximum price must be greater than or equal to 0")
      .custom(value => (value >= 0))
      .withMessage("Minimum price must be greater than or equal to 0"),
    check("maxPrice")
      .optional()
      .isDecimal()
      .withMessage("Maximum price must be greater than or equal to 0")
      .custom(value => value >= 0)
      .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
  ];


router.get('/', validateParams, async(req, res) => {
    const {  minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
    let { page, size } = req.query
    const results = {}
    const pagination = {}

    
    if (page || size) {

        if (size > 20) size = 20
        if (page > 10) page = 10
    
        
        if (page >= 1 && size >= 1) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
        }
    }

    const where = {};
    if (minLat && maxLat) {
        where.lat = {
            [Op.between]: [minLat, maxLat]
        }
    }

    if (minLat && !maxLat) {
        where.lat = {
            [Op.gte]: [minLat]
        }
    }

    if (maxLat && !minLat) {
        where.lat = {
            [Op.lte]: [maxLat]
        }}

    if (minLng && maxLng) {
        where.lng = {
            [Op.between]: [minLng, maxLng]
        }}

    if (minLng && !maxLng) {
        where.lng = {
            [Op.gte]: [minLng]
        }};

    if (maxLng && !minLng) {
        where.lng = {
            [Op.lte]: [maxLng]
        }};

    if (minPrice && maxPrice) {
        where.price = {
            [Op.between]: [minPrice, maxPrice]
        }}

    if (minPrice && !maxPrice) {
        where.price = {
            [Op.gte]: [minPrice]
        }};

    if (maxPrice && !minPrice) {
        where.price = {
            [Op.lte]: [maxPrice]
        }};

    const spots = await Spot.findAll({
        include: [{
            model: Review
        }],
        where,
        ...pagination
    })

    let spotsList = [];

    spots.forEach(spot => {
        spotsList.push(spot.toJSON());
    });

    const images = await SpotImage.unscoped().findAll({
        include: [Spot]
    })


    spotsList.forEach(spot => {

        spot.lat = Number.parseFloat(spot.lat);
        spot.lng = Number.parseFloat(spot.lng);
        spot.price = Number.parseFloat(spot.price);
        spot.avgRating = 'No reviews found';

        spot.Reviews.forEach(review => {

            if (review.stars) {
                let totalStars = spot.Reviews.reduce((sum, review) => (sum + review.stars), 0)
                avgStars = totalStars / spot.Reviews.length
                spot.avgRating = avgStars;
            }
        });

        delete spot.Reviews;
    });

    if (spotsList.length === 0) return res.status(400).json({ message: "No spots found" });

    results.Spots = spotsList
    if (page) results.page = page;
    if (size) results.size = size;


    return res.json(results);
});

router.get('/current', requireAuth, async(req, res) => {
    const userSpots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })
    userSpots.forEach(spot => {
        spot.lat = Number.parseFloat(spot.lat)
        spot.lng = Number.parseFloat(spot.lng)
    })

    const spots = {
        Spots: userSpots
    }
    res.json(spots)
});

router.get('/:spotId', async(req, res, next) => {
    const spotId = req.params.spotId
    
    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    });

    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const numReviews = await calculateNumReviews(spotId);
    const avgRating = await calculateAvgRating(spotId);
    const spotImages = await SpotImage.findAll({
        where: {
            id: spotId
        },
        attributes: {
                exclude: ['spotId', 'createdAt', 'updatedAt']
            }   
    })

    const owner = await User.findOne({
        where: {
            id: spot.ownerId
        }
    })

    const safeOwner = {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName
    }
    

        responseSpot = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: Number.parseFloat(spot.lat),
            lng: Number.parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: Number.parseFloat(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: numReviews,
            avgStarRating: avgRating,
            SpotImages: spotImages,
            Owner: safeOwner
        }

        return res.json(responseSpot);
    });

router.post('/', requireAuth, validateSpot, async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;


    const spot = await Spot.create({
        ownerId, 
        address, 
        city, 
        state, 
        country, 
        lat: Number.parseFloat(lat), 
        lng: Number.parseFloat(lng), 
        name, 
        description, 
        price,
    })

    const responseSpot = {
        id: spot.id,
        ownerId, 
        address, 
        city, 
        state, 
        country, 
        lat: Number.parseFloat(lat), 
        lng: Number.parseFloat(lng), 
        name, 
        description, 
        price: Number.parseFloat(price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
    }

    res.json(responseSpot)
})

router.post('/:spotId/images', requireAuth, async(req, res, next) => {
    //Verifies spot and owner
    const userId = req.user.id
    const spotId = req.params.spotId

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };

    if(spot.ownerId !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err)
    }

    const { url, preview } = req.body;

    if(preview) {
        await Spot.update({
            previewImage: url
        }, {
            where: {
                id: spotId
            }
        })
    }


    const image = await SpotImage.create({ spotId, url, preview });

    const responseImage = await SpotImage.findOne({
        where: {
            id: image.id
        },
        attributes: {
            exclude: ['spotId', 'updatedAt', 'createdAt']
        }
    })

    res.json(responseImage)
});

router.put('/:spotId', requireAuth, validateSpot, async( req, res, next) => {
    //Verifies spot and owner
    const userId = req.user.id;
    const spotId = req.params.spotId;
    

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    });
    
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };

    if(spot.ownerId !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err)
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    await Spot.update({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
        name: name,
        description: description,
        price: Number.parseFloat(price)
    }, {
        where: {
            id: spotId
        }
    })

    const responseSpot = await Spot.findOne({
        where: {
            id: spotId
        }
    });

    const safeSpot = {
        id: responseSpot.id,
        ownerId: responseSpot.ownerId, 
        address: responseSpot.address, 
        city: responseSpot.city, 
        state: responseSpot.state, 
        country: responseSpot.country, 
        lat: Number.parseFloat(responseSpot.lat), 
        lng: Number.parseFloat(responseSpot.lng), 
        name: responseSpot.name, 
        description: responseSpot.description, 
        price: Number.parseFloat(responseSpot.price),
        createdAt: responseSpot.createdAt,
        updatedAt: responseSpot.updatedAt

    }

    res.json(safeSpot)
})

router.delete('/:spotId', requireAuth, async(req, res, next) => {
    //Verifies spot and owner
    const userId = req.user.id;
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    });

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };
    
    if(spot.ownerId !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err)
    };

    await Spot.destroy({
        where: {
            id: spotId
        }
    })

    res.json({
        message: 'Successfully deleted'
    })
})

router.get('/:spotId/reviews', async(req, res, next) => {
    const spotId = req.params.spotId;
    
    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
    
    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        }
    })

    res.json(reviews)
});

router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res, next) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const { review, stars} = req.body;


    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const sampleReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: userId
        }
    })

    if(sampleReview) {
        const err = new Error("User already has a review for this spot");
        err.status = 500;
        return next(err);
    }

    const secret = await Review.create({spotId, userId, review, stars});
    const responseReview = {
        id: secret.id,
        userId,
        spotId: Number.parseFloat(spotId),
        review,
        stars,
        createdAt: secret.createdAt,
        updatedAt: secret.updatedAt
    }

    res.json(responseReview);
})


//Create a Booking for spot
router.post('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId
        }
    })

    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    if(spot.ownerId === userId) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err)
    }

    const err = new Error("Bad Request")
    err.status = 400
    const errors = []

    const { startDate, endDate } = req.body

    const requestStart = new Date(startDate);
    const requestEnd = new Date(endDate);

    const today = new Date()

    if (requestStart < today) {
        err.message = "Bad request";
        err.status = 400;
        err.errors = { startDate: "startDate cannot be in the past" };
        errors.push(err);
        return next(err)
    }

    if (requestEnd <= requestStart) {
        err.message = "Bad request";
        err.status = 400;
        err.errors = { endDate: "endDate cannot be on or before startDate" };
        errors.push(err);
        return next(err)
    }

    const booked = await Booking.findAll({
        where: {
            spotId: spotId
        }
    })

    if(booked.length) {
        if(endDate > startDate) {
        for (let booking of booked) {
                const start_exist = new Date(booking.startDate);
                const end_exist = new Date(booking.endDate);
                const start = new Date(startDate)
                const end = new Date(endDate);
            //dates within existing booking
            if(start_exist <= start && end_exist>= end) {
                //console.log("in this case1")
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403;
                return next(err);
            }
            //start date on existing start date/end date
            if (start >= start_exist && start <= end_exist) {
                //console.log("in this case2")
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403;
                err.errors = {}
                err.errors.startDate = "Start date conflicts with an existing booking"
                return next(err);
            }
            //end date on existing start date/end date
            if (end >= start_exist && end <= end_exist) {
                //console.log("in this case3")
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403;
                err.errors = {}
                err.errors.endDate = "End date conflicts with an existing booking"
                return next(err);
            }
            //dates surrond existing boooking
            if(start>= start_exist && end >= end_exist) {
                //console.log("in this case4")
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403;
                return next(err);
            }
        }
    }}



    const booking = await Booking.create({ spotId, userId, startDate, endDate})

    res.json(booking)
});

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId
    const {user} = req
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    };
    if (spot.ownerId === user.id) {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            include: {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
                
            }
        )
        return res.json({Bookings: bookings});
    }
    else {
        const bookings = await Booking.findAll({
            where: {
                spotId
                },
            attributes: ["spotId", "startDate", "endDate"]
            }
        )
        return res.json({Bookings: bookings});
    }
});



    







module.exports = router;