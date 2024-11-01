import User from "../model/User.js";
import AsyncHandler from "express-async-handler";
import bccrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

//@desc register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = AsyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  //check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  //hash password
  const salt = await bccrypt.genSalt(10);
  const hashedPassword = await bccrypt.hash(password, salt);
  //create user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "Success",
    msg: "User registered successfully",
    data: user,
  });
});

// @desc login user
// @route POST /api/v1/users/login
// @access Public
// @param {string} email
// @param {string} password
// @return {object} JWT token
// @return {object} User data

export const loginUserCtrl = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check user exists in db by email only
  const userFound = await User.findOne({ email });
  if (userFound && (await bccrypt.compare(password, userFound?.password))) {
    //generate token
    //const token = userFound.generateToken();
    res.json({
      status: "Success",
      msg: "User logged in successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid login credentials");
  }
});

// @desc get user profile
// @route GET /api/v1/users/profile
// @access Private
// @return {object} User data

export const getUserProfileCtrl = AsyncHandler(async (req, res) => {
  //find the user
  const user = await User.findById(req.userAuthId).populate("orders");
  if (!user) {
    throw new Error("User not found");
  }
  res.json({
    status: "success",
    msg: "User profile fetched successfully",
    user,
  });
});

// @desc update user shipping address
// @route PUT /api/v1/users/update/shipping
// @access Private
// @return {object} User data

export const updateUserShippingCtrl = AsyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    country,
    postalCode,
    province,
    phone,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        country,
        postalCode,
        province,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    msg: "Shipping address updated successfully",
    user,
  });
});
