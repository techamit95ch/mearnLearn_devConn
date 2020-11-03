const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
router.get('/',auth,async(req,res)=>{
    // res.send('Auth Router');
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user); 
    }catch (error) {
            // console.error(error.message); 
            res.status(500).json({msg:{
                "error":error.message
            }});
        }
});

router.post(
  "/",
  [ 
    check("email", "Email is required").isEmail(),
    check("password", "Password does not exists").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    // Getting string values from request body
    const {  email, password } = req.body;
    try {
      // Find User
      let user = await User.findOne({ email });
      // see if user exists
      if (!user)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credential" }] });
    
      const isMatch = bcrypt.compare(password,user.password);
      if (!isMatch) return res.status(404).json({ errors:{ msg:'Invalid Credential'}});
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000},
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      // assert.isNotOk(error, "Promise error");
      // done();
      res.status(500).send(error.message);
    //   done();
    }
  }
);


module.exports = router;
