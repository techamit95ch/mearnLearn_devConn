const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const config = require("config");
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be length 4").isLength({ min: 4, max: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    // Getting string values from request body
    const { name, email, password } = req.body;

    try {
      // Find User
      let user = await User.findOne({ email });
      // see if user exists
      if (user)
        res.status(400).json({ errors: [{ msg: "User Already exists" }] });
      // get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      user = new User({ name, email, password, avatar });
      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save data in user
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // res.send('User Registered');

      // res.send("Users Route");
    } catch (error) {
      console.error(error.message);
      // assert.isNotOk(error, "Promise error");
      // done();
      res.status(500).send(error.message);
      done();
    }
  }
);

module.exports = router;
