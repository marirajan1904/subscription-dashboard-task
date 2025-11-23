"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPlans = listPlans;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function listPlans(req, res) {
    const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });
    res.json(plans);
}
