import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorCtrl, getAllColorsCtrl, getSingleColorCtrl, updateColorCtrl, deleteColorCtrl } from "../controllers/colorCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";
createColorCtrl

const colorsRouter = express.Router();

colorsRouter.post("/", isLoggedIn, isAdmin,createColorCtrl );
colorsRouter.get("/",  getAllColorsCtrl);
colorsRouter.get("/:id", getSingleColorCtrl );
colorsRouter.put("/:id", isLoggedIn, isAdmin, updateColorCtrl);
colorsRouter.delete("/:id",isLoggedIn,isAdmin, deleteColorCtrl );
export default colorsRouter;
