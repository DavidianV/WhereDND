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



module.exports = router; 