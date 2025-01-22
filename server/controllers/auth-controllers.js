const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

//regisetr Logic

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const saltRound = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, saltRound);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error accured",
    });
  }
};

// Login Logic

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error accured",
    });
  }
};

module.exports = { register };
