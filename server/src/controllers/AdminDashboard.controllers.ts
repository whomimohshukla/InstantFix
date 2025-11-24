import { Request, Response } from "express";
import { adminDashboardService } from "../services/adminDashboard.service";

export const adminDashboardSummaryCtrl = async (_req: Request, res: Response) => {
  const result = await adminDashboardService.summary();
  res.status(result.status).json(result);
};

export const adminDashboardTimeseriesCtrl = async (req: Request, res: Response) => {
  const result = await adminDashboardService.timeseries(req.query);
  res.status(result.status).json(result);
};
