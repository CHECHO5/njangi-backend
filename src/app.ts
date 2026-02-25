import Fastify from "fastify";
import cors from "@fastify/cors";
import rawBody from "fastify-raw-body";

import { paymentsRoutes } from "./modules/payments/payments.routes.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  // Needed later for Stripe webhook signature verification
  await app.register(rawBody, {
    field: "rawBody",
    global: false,
    encoding: false,
    runFirst: true,
  });

  // Root (so browser / doesn't 404)
  app.get("/", async () => ({
    ok: true,
    service: "njangi-backend",
  }));

  // Health check
  app.get("/health", async () => ({ ok: true }));

  // ✅ Mount payments routes
  await app.register(paymentsRoutes);

  return app;
}
