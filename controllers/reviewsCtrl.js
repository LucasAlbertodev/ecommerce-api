import Product from "../model/Products.js";
import Review from "../model/Review.js";
import asyncHandler from "express-async-handler";

//@desc Create new review
// @route POST /api/v1/reviews
// @access Private/Admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;
  //find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product not found");
  }
  //check if user already review the product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("User has already reviewed this product");
  }
  //create review
  const review = await Review.create({
    user: req.userAuthId,
    product: productFound?._id,
    message,
    rating,
  });
  //push review into product found
  productFound.reviews.push(review?._id);
  await productFound.save();
  res.status(201).json({
    status: "success",
    msg: "Review created successfully",
  });
});
