import express from "express";
import { createOrderCtrl, getAllOrdersCtrl, getSingleOrderCtrl,updateOrderCtrl,getOrderStatsCtrl } from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const ordersRouter = express.Router();

ordersRouter.post("/", isLoggedIn, createOrderCtrl);
ordersRouter.get("/", isLoggedIn, getAllOrdersCtrl);
ordersRouter.get("/sales/stats", isLoggedIn, getOrderStatsCtrl);
ordersRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
ordersRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);

export default ordersRouter;
