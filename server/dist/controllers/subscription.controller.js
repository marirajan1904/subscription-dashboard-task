"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = subscribe;
exports.mySubscription = mySubscription;
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
const prisma = new client_1.PrismaClient();
async function subscribe(req, res) {
    const { planId } = req.params;
    const user = req.user;
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan)
        return res.status(404).json({ message: "Plan not found" });
    const now = (0, dayjs_1.default)();
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
async function mySubscription(req, res) {
    const user = req.user;
    const sub = await prisma.subscription.findFirst({
        where: { user_id: user.sub },
        orderBy: { start_date: "desc" },
        include: { plan: true },
    });
    if (!sub)
        return res.json({ status: "none", subscription: null });
    const now = (0, dayjs_1.default)();
    const status = now.isAfter((0, dayjs_1.default)(sub.end_date)) ? "expired" : sub.status.toLowerCase();
    res.json({ status, subscription: sub });
}
