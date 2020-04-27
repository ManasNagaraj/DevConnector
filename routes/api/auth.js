const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');

//@route GET api/auth
//@desc  Test route
//@acess Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

///this function get this exports the all the functions to auth the user

router.post(
  '/',
  [
    check('email', 'Please include email').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //see if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(500)
          .json({ errors: [{ msg: 'invalid credentials' }] });
      }
      //return jsonwebtoken

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(500)
          .json({ errors: [{ msg: 'invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      console.log(req.body);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;

//async and await works as the multi threading for the fuxntion and awaits for the function to return a promise
