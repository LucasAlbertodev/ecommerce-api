import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();
import paypal from "@paypal/checkout-server-sdk";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Products.js";
import { paypalClient } from "./paypalCtrl.js";
import Stripe from "stripe";
import Coupon from "../model/Coupon.js";

//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  //get coupons
  const { coupon } = req?.query;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });
  if (couponFound?.isExpired) {
    throw new Error("Coupon is expired");
  }
  if (!couponFound) {
    throw new Error("Coupon not found");
  }

  //get discount
  const discount = couponFound?.discount / 100;

  //get the payload(customer, orderitems,shippingAddress,totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //find the user
  const user = await User.findById(req.userAuthId);
  //check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //check if order is not empty
  if (!orderItems || orderItems?.length <= 0) {
    throw new Error("No order items");
  }
  //place/create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    //totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });
  console.log(order);
  //push order into user
  user.orders.push(order?._id);
  await user.save();

  //update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  if (!products) {
    return res.status(400).json({ message: "Invalid product" });
  }

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id.toString();
    });
    console.log(product);
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });

  const purchase_units = orderItems.map((item) => {
    return {
      amount: {
        currency_code: "USD",
        value: (item.price * item.qty).toFixed(2),
        breakdown: {
          item_total: {
            currency_code: "USD",
            value: item.price * item.qty.toFixed(2),
          },
        },
      },
      items: [
        {
          name: item.name,
          unit_amount: {
            currency_code: "USD",
            value: item.price.toFixed(2),
          },
          quantity: item.qty,
          sku: item._id,
        },
      ],
    };
  });

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "USD",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  let methodPayment = 1;

  const Payment = methodPayment;

  switch (Payment) {
    case 1:
      //make payment(stripe)
      const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
          orderId: JSON.stringify(order?._id),
        },
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });
      res.send({
        url: session.url,
      });

      break;

    case 2:
      //make payment(paypal)
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: purchase_units,
        application_context: {
          user_action: "PAY_NOW",
          return_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
          brand_name: "Ecommerce-Node-React",
          shipping_preference: "NO_SHIPPING",
        },
      });
      try {
        const orderResponse = await paypalClient.execute(request);
        res.status(201).json({
          id: orderResponse.result.id,
          link: orderResponse.result.links.find(
            (link) => link.rel === "approve"
          ).href,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating PayPal order", error });
      }

      break;
    default:
      break;
  }
});

//@desc create all orders
//@route GET /api/v1/orders
//@access private

export const getAllOrdersCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json({
    status: "success",
    msg: "Orders fetched successfully",
    orders,
  });
});

//@desc Get single order
//@route GET /api/v1/order/:id
//@access private

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new Error("Order not found");
  }
  res.json({
    status: "success",
    msg: "Order fetched successfully",
    order,
  });
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!updatedOrder) {
    throw new Error("Order not found");
  }
  res.json({
    status: "success",
    msg: "Order updated successfully",
    updatedOrder,
  });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSales: {
          $max: "$totalPrice",
        },
        averageSale: {
          $avg: "$totalPrice",
        }
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalTodaySales: {
          $sum: "$totalPrice",
        },
      },
    },
  ])
  //send response
  res.status(200).json({
    status: "success",
    msg: "Sales stats fetched successfully",
    orders,
    saleToday
  });
});
