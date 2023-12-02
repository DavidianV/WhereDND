const express = require('express')
const router = express.Router();
const { Spot } = require('../../db/models')
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
        .custom(price => price < 0)
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
    const { address, city, state, country, lat, lng, name, description, price } = req.query.params;
    const ownerId = req.user.id;

    const spot = await Spot.create({ownerId, address, city, state, country, lat, lng, name, description, price})

    res.json(spot)
})




module.exports = router;