import express from "express";
import { loginUserCtrl, registerUserCtrl, getUserProfileCtrl, updateUserShippingCtrl } from "../controllers/usersCtr.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post('/login', loginUserCtrl);
userRoutes.get('/profile',isLoggedIn, getUserProfileCtrl);
userRoutes.put('/update/shipping',isLoggedIn, updateUserShippingCtrl);

export default userRoutes;