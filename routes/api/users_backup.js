const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const config = require("config");
const assert = require("assert");
router.post("/test", (req, res) => {
  // res.send("Test Router");
  const { name, email, password } = req.body;
  res.json({
    msg: name,
  });
});
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be length 4").isLength({
      min: 4,
      max: 8,
    }),
  ],
  async (req, res,done) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }
    // Getting string values from request body
    const { name, email, password } = req.body;
    // console.log(name, email, password);
    try {
      // Find User
      let user = await User.findOne({
        email,
      });
      res.send(user);
      console.log(user);
      if (user)
        res.status(400).json({ errors: [{ msg: "User Already exists" }] });
    //   else {
        const avatar = gravatar.url(email, {
          s: "200",
          r: "pg",
          d: "mm",
        });
        user = new User({
          name,
          email,
          password,
          avatar,
        });
        // const salt = await bcrypt.genSalt(10);
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
            expiresIn: 3000,
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
            });
          }
        );
    //   }
    } catch (error) {
        console.error(error.message);
        assert.isNotOk(error, "Promise error");
        res.status(500).send(error.message);
        done();
    }
  }
);

module.exports = router;
