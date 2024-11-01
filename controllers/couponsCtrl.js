import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

//@desc Create new Coupon
//@route POST /api/v1/coupons
//@access Private/Admin

export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  //check if admin
  const couponsExists = await Coupon.findOne({
    code,
  });
  if (couponsExists) {
    throw new Error("Coupon already exists");
  }
  //check of discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount must be a number");
  }
  //create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId, //add user id to the coupon document
  });
  res.json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

//@desc Get all coupons
//@route GET /api/v1/coupons
//@access Private/Admin

export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  //validation
  if (!coupons) {
    throw new Error("No coupons found");
  }
  res.status(200).json({
    status: "success",
    message: "All Coupons fetched successfully",
    coupons,
  });
});

//@desc Get single coupon
//@route GET /api/v1/coupons/:id
//@access Private/Admin

export const getCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  //validation
  if (coupon === null) {
    throw new Error("Coupon not found");
  }
  if(coupon.isExpired){
    throw new Error("Coupon is expired");
  }

  res.status(200).json({
    status: "success",
    message: "Coupon fetched successfully",
    coupon,
  });
});

//@desc Update coupon
//@route PUT /api/v1/coupons/:id
//@access Private/Admin

export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  //check if admin
  //update coupon
  const updatedCoupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon: updatedCoupon,
  });
});

//@desc Delete coupon
//@route DELETE api/v1/delete
//@access Private/admin

export const deleteCouponCtrl = asyncHandler(async (req, res) => {
  //delete coupon
const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});
