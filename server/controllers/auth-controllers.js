const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

//* Register User Logic

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    const userNameExist = await User.findOne({ userName });

    if (userExist) {
      return res.json({
        success: false,
        message: "User Already Exist !",
        description: "Try again with another Email",
      });
    }

    if (userNameExist) {
      return res.json({ success: false, message: "Try Another User Name !" });
    }

    const saltRound = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, saltRound);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration Successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//* Login User Logic

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.json({ success: false, message: "User doesn't Exist !" });
    }

    const checkPasswordValid = await bcrypt.compare(
      password,
      userExist.password
    );

    if (!checkPasswordValid) {
      return res.json({ success: false, message: "Incorrect Password !" });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        role: userExist.role,
        email: userExist.email,
        userName: userExist.userName,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged In Successfully !",
      user: {
        email: userExist.email,
        role: userExist.role,
        id: userExist._id,
        userName: userExist.userName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//* Logout User Logic

const logout = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged Out Successfully !",
  });
};

module.exports = { register, login, logout };
