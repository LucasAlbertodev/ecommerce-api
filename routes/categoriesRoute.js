import express from "express";
import { createCategoryCtrl, getAllCategoriesCtrl,getSingleCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } from "../controllers/categoryCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import categoryUpload from "../config/categoryUpload.js";


const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn,categoryUpload.single('file'), createCategoryCtrl);
categoriesRouter.get("/",  getAllCategoriesCtrl);
categoriesRouter.get("/:id",  getSingleCategoryCtrl);
categoriesRouter.put("/:id", isLoggedIn,updateCategoryCtrl);
categoriesRouter.delete("/:id",isLoggedIn, deleteCategoryCtrl);
export default categoriesRouter;
