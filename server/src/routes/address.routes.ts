import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  listAddressesCtrl,
  createAddressCtrl,
  updateAddressCtrl,
  deleteAddressCtrl,
} from "../controllers/Address.controllers";

export const addressRouter = Router();

addressRouter.use(authJwt, requireRole("CUSTOMER"));

addressRouter.get("/addresses", listAddressesCtrl);
addressRouter.post("/addresses", createAddressCtrl);
addressRouter.patch("/addresses/:id", updateAddressCtrl);
addressRouter.delete("/addresses/:id", deleteAddressCtrl);
