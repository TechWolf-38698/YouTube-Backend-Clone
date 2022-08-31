const express = require("express");
const User = require("../models/user");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// Creating user using post method "http://localhost:5000/api/users/rigister"
router.post(
  "/users/rigister",
  [
    body("f_name").isLength({ min: 1 }),
    body("l_name").isLength({ min: 1 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check if there are any errors in the request
    const errors = validationResult(req);
    // If there are errors, return the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // If there are no errors, get data from the request
    const { f_name, l_name, email, password } = req.body;

    // Check if the user already exists
    try {
      // get user from the database by email
      let user = await User.findOne({ email });
      // If the user exists, return message
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // If the user doesn't exist, create a new user
      user = await User.create({
        f_name: f_name,
        l_name: l_name,
        email: email,
        password: hashedPassword,
      });
      console.log(user);
      // Return the user & success message
      res.send({ msg: "User created successfully", user: user });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// Login user using post method "http://localhost:5000/api/users/login"
router.post(
  "/users/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    // Check if there are any errors in the request
    const errors = validationResult(req);
    // If there are errors, return the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // If there are no errors, get data from the request
    const { email, password } = req.body;
    // Check if the user exists
    try {
      // get user from the database by email
      let user = await User.findOne({ email });
      // If the user doesn't exist, return message
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      // If the user exists, check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      // If the password is incorrect, return message
      if (!isMatch) {
        return res.status(400).send({ msg: "Incorrect password" });
      }
      // If the password is correct, return the user & success message
      res.send({ msg: "User logged in successfully", user: user });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

// Login user using post method "http://127.0.0.1:5000/api/users/finduser"
router.post("/users/finduser", [body("email").isEmail()], async (req, res) => {
  // Check if there are any errors in the request
  const errors = validationResult(req);
  // If there are errors, return the errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // If there are no errors, get data from the request
  const { email } = req.body;
  // Check if the user exists
  try {
    // get user from the database by email
    let user = await User.findOne({ email });
    // If the user doesn't exist, return message
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    res.send({ email: user.email });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a route to find user with id "http://localhost:5000/api/users/finduser/byID/:id"
router.get("/users/finduser/byID/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    // get user from the database by email
    let user = await User.findOne({ _id });
    // If the user doesn't exist, return message
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    } else {
      var _user = {
        f_name: user.f_name,
        l_name: user.l_name,
        email: user.email,
        _id: user._id,
      };
      res.send({ _user });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
