const express = require('express');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { SpotImage, Spot } = require('../../db/models');

router.delete('/:spotImageId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const spotImageId = req.params.spotImageId

    const spotImage = await SpotImage.findOne({
        where: {
            id: spotImageId
        }
    })

    if(!spotImage) {
        const err = new Error("Image couldn't be found");
        err.status = 404;
        return next(err)
    }
    const spot = await Spot.findOne({
        where: {
            id: spotImage.spotId
        }
    })

    if(spot.ownerId !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err)
    }

    if(spotImage.preview) {
        await Spot.update({
            previewImage: null
        }, {
            where: {
                id: spot.id
            }
        })
    }

    await SpotImage.destroy({
        where: {
            id: spotImageId
        }
    })

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;