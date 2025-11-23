import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listPlans(req: Request, res: Response) {
  const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });
  res.json(plans);
}