import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

// @desc Create new category
// @route POST /api/v1/categories
// @access Private/Admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //check if category already exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    throw new Error("Category already exists");
  }
  //Create new category
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path,
  });
  res.status(201).json({
    status: "success",
    msg: "Category created successfully",
    category,
  });
});

//@desc Get all categories
// @route GET /api/v1/categories
// @access Public

export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({
    status: "success",
    msg: "Categories fetched successfully",
    categories,
  });
});

//@desc Get single category
// @route GET /api/v1/categories/:id
// @access Public

export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new Error("Category not found");
  }
  res.json({
    status: "success",
    msg: "Category fetched successfully",
    category,
  });
});

//@desc Update category
// @route PUT /api/v1/categories/:id
// @access Private/Admin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!category) {
    throw new Error("Category not found");
  }
  res.json({
    status: "success",
    msg: "Category updated successfully",
    category,
  });
});

//@desc Delete category
// @route DELETE /api/v1/categories/:id
// @access Private/Admin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ msg: "Category not found" });
  }
  res.json({
    status: "success",
    msg: "Category deleted successfully",
  });
});
