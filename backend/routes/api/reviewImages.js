const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId
    const {user} = req

    const image = await ReviewImage.findByPk(imageId, {
        include: {
            model: Review,
            attributes: ["userId"],
        },
    })
    if (!image) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return next(err);
    }
        
    if (user.id !== image.Review.userId) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
        }
    await ReviewImage.destroy({
        where: {
            id: imageId
        }
    });
    return res.json({
        "message": "Successfully deleted"
        })
})

module.exports = router;