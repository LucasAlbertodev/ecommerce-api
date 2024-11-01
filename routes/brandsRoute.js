import express from "express";
import { createBrandCtrl,getAllbrandsCtrl,getSingleBrandCtrl,updateBrandCtrl,deleteBrandCtrl } from "../controllers/brandCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const brandsRouter = express.Router();

brandsRouter.post("/", isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get("/",  getAllbrandsCtrl);
brandsRouter.get("/:id",  getSingleBrandCtrl);
brandsRouter.put("/:id", isLoggedIn, isAdmin, updateBrandCtrl);
brandsRouter.delete("/:id",isLoggedIn,isAdmin, deleteBrandCtrl);
export default brandsRouter;
