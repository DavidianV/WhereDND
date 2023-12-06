const express = require('express');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { Review } = require('../../db/models');

router.get('/current', requireAuth, async(req, res) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: {
            userId: userId
        }
    })

    res.json(reviews)
});

router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    //Verifies spot and owner
    const userId = req.user.id
    const reviewId = req.params.reviewId

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

    if(review.ownerId !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err)
    }

    const { url, preview } = req.body;
    // console.log('###', preview)
    if(preview) {
        await Review.update({
            previewImage: url
        }, {
            where: {
                id: reviewId
            }
        })
    }

    console.log(await Review.findOne({
        where: {
            id: reviewId
        }
    }))

    const image = await ReviewImage.create({ reviewId, url, preview });

    const responseImage = await ReviewImage.findOne({
        where: {
            id: image.id
        },
        attributes: {
            exclude: ['reviewId', 'updatedAt', 'createdAt']
        }
    })

    res.json(responseImage)
});

router.put('/')

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