import { Router } from "express";
import { geocodeCtrl, reverseCtrl } from "../controllers/Geo.controllers";

export const geoRouter = Router();

// Public: you may add rate limiting middleware if needed
geoRouter.post("/geocode", geocodeCtrl);
geoRouter.post("/reverse", reverseCtrl);
