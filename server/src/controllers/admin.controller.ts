import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listAllSubscriptions(req: Request, res: Response) {
  const subs = await prisma.subscription.findMany({
    orderBy: { start_date: "desc" },
    include: { user: true, plan: true },
  });
  res.json(subs);
}