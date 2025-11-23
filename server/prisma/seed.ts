import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.plan.count();
  if (count > 0) {
    console.log("Plans already seeded.");
    return;
  }
  await prisma.plan.createMany({
    data: [
      {
        name: "Starter",
        price: 199,
        features: ["Basic analytics", "Email support"],
        duration: 30,
      },
      {
        name: "Pro",
        price: 499,
        features: ["Advanced analytics", "Priority support", "Team access"],
        duration: 90,
      },
      {
        name: "Business",
        price: 999,
        features: ["Custom reports", "SLA", "Dedicated manager"],
        duration: 180,
      },
      {
        name: "Enterprise",
        price: 1999,
        features: ["SSO", "Audit logs", "Custom SLA"],
        duration: 365,
      },
    ],
  });
  console.log("Seeded plans.");
}

main().finally(async () => {
  await prisma.$disconnect();
});