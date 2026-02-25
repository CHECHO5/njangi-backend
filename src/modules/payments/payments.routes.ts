import type { FastifyInstance } from "fastify";
import { prisma } from "../../db/prisma.js";
import { apiKeyAuth } from "../../middleware/apiKeyAuth.js";
import { CreatePaymentRequestSchema } from "./payments.dto.js";

export async function paymentsRoutes(app: FastifyInstance) {
  // Protect all routes in this module
  app.addHook("preHandler", apiKeyAuth);

  // quick sanity route
  app.get("/payments", async () => ({ ok: true }));

  // create a PaymentTransaction (validated)
  app.post("/payments/create", async (req, reply) => {
    const parsed = CreatePaymentRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() });
    }

    const body = parsed.data;

    const created = await prisma.paymentTransaction.create({
      data: {
        groupId: body.groupId,
        memberId: body.memberId ?? null,
        amountMinor: body.amountMinor,
        currency: body.currency,
        provider: body.provider,
        status: "created",
      },
    });

    return { transaction: created };
  });

  // fetch a transaction by id
  app.get("/payments/transactions/:id", async (req, reply) => {
    const id = (req.params as any).id as string;

    const tx = await prisma.paymentTransaction.findUnique({ where: { id } });
    if (!tx) return reply.code(404).send({ error: "Not found" });

    return { transaction: tx };
  });

  // list recent transactions
  app.get("/payments/transactions", async () => {
    const items = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { items };
  });
}
