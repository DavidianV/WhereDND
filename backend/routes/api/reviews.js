const express = require('express');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { Review, ReviewImage, User, Spot } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

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

router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    const response = {
        Reviews: reviews
    }

    res.json(response)
});

router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    //Verifies spot and owner
    const userId = req.user.id
    const reviewId = req.params.reviewId
    if(!reviewId) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }

    const review = await Review.findOne({
        where: {
            id: reviewId
        }
    })

    if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    };

    if(review.userId !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err)
    }

    const images = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })

    let imagesList = [];

    images.forEach(image => {
        imagesList.push(image.toJSON());
    });

    if (imagesList.length >= 10) {
        const err = new Error("Maximum number of images for this resource was reached");
        err.status = 403;
        return next(err);
    }
    const { url } = req.body;
    
    const image = await ReviewImage.create({ reviewId, url});

    const responseImage = {
        id: image.id,
        url
    }

    res.json(responseImage)
});


router.put('/:reviewId', requireAuth, validateReview, async(req, res, next) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const testReview = await Review.findOne({
        where: {
            id: reviewId
        }
    });

    if (!testReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    };

    if (testReview.userId !== userId) {
        const err = new Error("Forbidden");
        err.status = 403
    return next(err)
    };

    const { review, stars } = req.body;

    await Review.update({
        review: review,
        stars: stars
    }, {
        where: {
            id: reviewId
        }
    })

    const responseReview = await Review.findOne({
        where: {
            id: reviewId
        }
    })

    res.json(responseReview)



});


//Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
    const userId = req.user.id
    const reviewId = req.params.reviewId

    const review = await Review.findOne({
        where: {
            id: reviewId
        }
    })

    if(!review) {
        const err = new Error("Review couldn't be found")
        err.status = 404
        return next(err)
    }

    if(review.userId !== userId) {
        const err = new Error("Forbidden")
        err.status = 403
        return next(err)
    }

    await Review.destroy({
        where: {
            id: reviewId
        }
    })

    res.json({
        message: 'Successfully deleted'
    })
})

module.exports = router; 