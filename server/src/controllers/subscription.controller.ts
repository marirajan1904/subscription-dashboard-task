import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

export async function subscribe(req: Request, res: Response) {
  const { planId } = req.params;
  const user = (req as any).user;
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  const now = dayjs();
  const end = now.add(plan.duration, "day");

  // expire existing active subs
  await prisma.subscription.updateMany({
    where: { user_id: user.sub, status: "ACTIVE" },
    data: { status: "EXPIRED" },
  });

  const sub = await prisma.subscription.create({
    data: {
      user_id: user.sub,
      plan_id: plan.id,
      start_date: now.toDate(),
      end_date: end.toDate(),
      status: "ACTIVE",
    },
    include: { plan: true },
  });

  res.status(201).json({ message: "Subscribed", subscription: sub });
}

export async function mySubscription(req: Request, res: Response) {
  const user = (req as any).user;
  const sub = await prisma.subscription.findFirst({
    where: { user_id: user.sub },
    orderBy: { start_date: "desc" },
    include: { plan: true },
  });
  if (!sub) return res.json({ status: "none", subscription: null });

  const now = dayjs();
  const status = now.isAfter(dayjs(sub.end_date)) ? "expired" : sub.status.toLowerCase();
  res.json({ status, subscription: sub });
}