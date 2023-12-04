const express = require('express')
const router = express.Router();
const { Spot, SpotImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

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
        .withMessage("Latitude is not valid"),
    check("lng")
        .exists({ checkFalsy: true })
        .isDecimal()
        .custom(lng => lng >= -180 && lng <= 180)
        .withMessage("Longitude is not valid"),
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


router.get('/', async(req, res) => {
    const spots = await Spot.findAll()

    res.json(spots)
});

router.get('/current', requireAuth, async(req, res) => {
    const userSpots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })

    res.json(userSpots)
});

router.get('/:spotId', async(req, res, next) => {
    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    })

    if(!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    res.json(spots)
})

router.post('/', requireAuth, validateSpot, async(req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;

    const spot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price})

    res.json(spot)
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
    console.log('###', preview)
    if(preview) {
        await Spot.update({
            previewImage: url
        }, {
            where: {
                id: spotId
            }
        })
    }

    console.log(await Spot.findOne({
        where: {
            id: spotId
        }
    }))

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
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
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

    res.json(responseSpot)
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
    
    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        }
    })

    if(!reviews) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    res.json(reviews)
});

router.post('/:spotId/reviews', requireAuth, async(req, res, next) => {
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

    await Review.create({spotId, userId})
})







module.exports = router;