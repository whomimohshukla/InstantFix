import { Router } from "express";
import {
  categoriesCtrl,
  servicesCtrl,
} from "../controllers/Catalog.controllers";

export const catalogRouter = Router();

catalogRouter.get("/categories", categoriesCtrl);
catalogRouter.get("/services", servicesCtrl);
