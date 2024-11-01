import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

//@desc Create new brand
// @route POST /api/v1/brands
// @access Private/Admin

export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //check if brand already exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists");
  }
  //Create new brand
  const brand = await Brand.create({ name: name.toLowerCase() , user: req.userAuthId });
  res.status(201).json({
    status: "success",
    msg: "Brand created successfully",
    brand,
  });
});

//@desc Get all brand
// @route GET /api/v1/brands
// @access Public

export const getAllbrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({
    status: "success",
    msg: "Brands fetched successfully",
    brands,
  });
});

//@desc Get single brand
// @route GET /api/v1/brands/:id
// @access Public

export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  res.json({
    status: "success",
    msg: "Brand fetched successfully",
    brand,
  });
});

//@desc Update brand
// @route PUT /api/v1/brands/:id
// @access Private/Admin

export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!brand) {
    throw new Error("Brand not found");
  }
  res.json({
    status: "success",
    msg: "Brand updated successfully",
    brand,
  });
});

// @desc Delete brand
// @route DELETE /api/v1/brands/:id
// @access Private/Admin

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    return res.status(404).json({ msg: "Brand not found" });
  }
  res.json({
    status: "success",
    msg: "Brand deleted successfully",
  });
});
