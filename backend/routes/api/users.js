const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Username is required'),
    check('firstName')
      .exists({checkFalsy: true})
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    handleValidationErrors
  ];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      //Duplicate email error handler
      const existingEmail = await User.findOne({
        where: {
          email: email
        }
      });

      if (existingEmail) {
        const err = new Error("User already exists");
      err.status = 500;
      err.errors = {
        "email": "User with that email already exists"
      };
      return next(err);
      }

      //Duplicate username error handler
      const existingUsername = await User.findOne({
        where: {
          username: username
        }
      })

      if (existingUsername) {
        const err = new Error("User already exists");
      err.status = 500;
      err.errors = {
        "username": "User with that username already exists"
      }
      return next(err);
      }


      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

  router.get('')



module.exports = router;