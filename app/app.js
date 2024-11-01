import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import productRoutes from "../routes/productsRoute.js";
import {
  globalErrHandler,
  notFoundHandler,
} from "../middlewares/globalErrorHandling.js";
import categoriesRouter from "../routes/categoriesRoute.js";
import brandsRouter from "../routes/brandsRoute.js";
import colorsRouter from "../routes/colorsRoute.js";
import reviewRouter from "../routes/reviewsRoute.js";
import ordersRouter from "../routes/ordersRoute.js";
import webhookRouter from "../routes/webhookRoute.js";
import Stripe from "stripe";
import Order from "../model/Order.js";
import couponsRouter from "../routes/couponsRoute.js";

// Connect to MongoDB database
dbConnect();
const app = express();
app.use(cors());
//stripe webhook
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = new Stripe(process.env.STRIPE_KEY);

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
const endpointSecret =
  "whsec_e6815dd9a063ee5e5bc8114a1dcb7235175e0003f3288f8d302672b12be28013";

// This example uses Express to receive webhooks

// Match the raw body to content type application/json
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log(event);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      console.log(orderId, paymentStatus, paymentMethod, totalAmount, currency);
      // Update the order in your database
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      );
      console.log(order);
    } else {
      return;
    }

    // // Handle the event
    // switch (event.type) {
    // case "payment_intent.succeeded":
    // const paymentIntent = event.data.object;
    // console.log("PaymentIntent was successful!");
    // break;
    // case "payment_method.attached":
    // const paymentMethod = event.data.object;
    // console.log("PaymentMethod was attached to a Customer!");
    // break;
    // // ... handle other event types
    // default:
    // console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a response to acknowledge receipt of the event

    response.json({ received: true });
    response.status(200).end();
    //response.send();
  }
);

//pass incoming data
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});
//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorsRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", ordersRouter);
app.use("/api/v1/coupons/", couponsRouter);

// Ruta del webhook de PayPal
app.use("/webhook/paypal", webhookRouter);

//error middleware
app.use(notFoundHandler);
app.use(globalErrHandler);
export default app;
