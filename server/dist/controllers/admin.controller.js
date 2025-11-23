"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllSubscriptions = listAllSubscriptions;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listAllSubscriptions(req, res) {
    const subs = await prisma.subscription.findMany({
        orderBy: { start_date: "desc" },
        include: { user: true, plan: true },
    });
    res.json(subs);
}
