const express = require('express');
const router = express.Router();
const { check, validatorResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/Users');
//@route GET api/profile/me
//@desc  Get current users profile
//@acess Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'the profile does not exist' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(201).send('authenication failure');
  }
});

//@route POST api/profile
//@desc  create or update a users profile
//@acess Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is reuired').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty,
    ],
  ],
  async (req, res) => {
    const errors = validatorResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

module.exports = router;
