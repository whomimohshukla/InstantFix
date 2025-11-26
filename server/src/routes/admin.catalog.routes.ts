import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  adminListCategoriesCtrl,
  adminCreateCategoryCtrl,
  adminUpdateCategoryCtrl,
  adminDeleteCategoryCtrl,
  adminListServicesCtrl,
  adminCreateServiceCtrl,
  adminUpdateServiceCtrl,
  adminDeleteServiceCtrl,
  adminAddServiceMediaCtrl,
  adminDeleteServiceMediaCtrl,
} from "../controllers/AdminCatalog.controllers";

export const adminCatalogRouter = Router();

adminCatalogRouter.use(authJwt, requireRole("ADMIN"));

// Categories
adminCatalogRouter.get("/categories", adminListCategoriesCtrl);
adminCatalogRouter.post("/categories", adminCreateCategoryCtrl);
adminCatalogRouter.patch("/categories/:id", adminUpdateCategoryCtrl);
adminCatalogRouter.delete("/categories/:id", adminDeleteCategoryCtrl);

// Services
adminCatalogRouter.get("/services", adminListServicesCtrl);
adminCatalogRouter.post("/services", adminCreateServiceCtrl);
adminCatalogRouter.patch("/services/:id", adminUpdateServiceCtrl);
adminCatalogRouter.delete("/services/:id", adminDeleteServiceCtrl);
adminCatalogRouter.post("/services/:id/media", adminAddServiceMediaCtrl);
adminCatalogRouter.delete("/services/:id/media/:mediaId", adminDeleteServiceMediaCtrl);
