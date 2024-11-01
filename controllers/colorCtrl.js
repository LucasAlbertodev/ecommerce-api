import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

//@desc Create new color
// @route POST /api/v1/colors
// @access Private/Admin

export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //check if color already exists
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("color already exists");
  }
  //Create new color
  const color = await Color.create({ name: name.toLowerCase() , user: req.userAuthId });
  res.status(201).json({
    status: "success",
    msg: "color created successfully",
    color,
  });
});

//@desc Get all color
// @route GET /api/v1/colors
// @access Public

export const getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  res.json({
    status: "success",
    msg: "colors fetched successfully",
    colors,
  });
});

//@desc Get single color
// @route GET /api/v1/colors/:id
// @access Public

export const getSingleColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color) {
    throw new Error("color not found");
  }
  res.json({
    status: "success",
    msg: "color fetched successfully",
    color,
  });
});

//@desc Update color
// @route PUT /api/v1/colors/:id
// @access Private/Admin

export const updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const color = await Color.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!color) {
    throw new Error("color not found");
  }
  res.json({
    status: "success",
    msg: "color updated successfully",
    color,
  });
});

//@desc Delete color
// @route DELETE /api/v1/colors/:id
// @access Private/Admin

export const deleteColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  if (!color) {
    return res.status(404).json({ msg: "color not found" });
  }
  res.json({
    status: "success",
    msg: "color deleted successfully",
  });
});
