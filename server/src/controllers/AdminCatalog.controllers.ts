import { Request, Response } from "express";
import { adminCatalogService } from "../services/adminCatalog.service";

// Categories
export const adminListCategoriesCtrl = async (_req: Request, res: Response) => {
  const result = await adminCatalogService.listCategories();
  res.status(result.status).json(result);
};
export const adminCreateCategoryCtrl = async (req: Request, res: Response) => {
  const result = await adminCatalogService.createCategory(req.body);
  res.status(result.status).json(result);
};
export const adminUpdateCategoryCtrl = async (req: Request, res: Response) => {
  const result = await adminCatalogService.updateCategory(req.params.id, req.body);
  res.status(result.status).json(result);
};
export const adminDeleteCategoryCtrl = async (req: Request, res: Response) => {
  const result = await adminCatalogService.deleteCategory(req.params.id);
  res.status(result.status).json(result);
};

// Services
export const adminListServicesCtrl = async (req: Request, res: Response) => {
  const result = await adminCatalogService.listServices(req.query);
  res.status(result.status).json(result);
};
export const adminCreateServiceCtrl = async (req: Request, res: Response) => {
  const result = await adminCatalogService.createService(req.body);
  res.status(result.status).json(result);
};
export const adminUpdateServiceCtrl = async (req: Request, res: Response) => {
  const result = await adminCatalogService.updateService(req.params.id, req.body);
  res.status(result.status).json(result);
};
export const adminDeleteServiceCtrl = async (req: Request, res: Response) => {
  const result = await adminCatalogService.deleteService(req.params.id);
  res.status(result.status).json(result);
};
