const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

//regisetr Logic

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.json({ success: false, message: "User Already Exist !" });
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

// Login Logic

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
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged In Successfully",
      user: {
        email: userExist.email,
        role: userExist.role,
        id: userExist._id,
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

module.exports = { register,login };
