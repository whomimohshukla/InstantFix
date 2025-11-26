import { Router } from "express";
import {
  categoriesCtrl,
  servicesCtrl,
  serviceDetailCtrl,
} from "../controllers/Catalog.controllers";

export const catalogRouter = Router();

catalogRouter.get("/categories", categoriesCtrl);
catalogRouter.get("/services", servicesCtrl);
catalogRouter.get("/services/:id", serviceDetailCtrl);
