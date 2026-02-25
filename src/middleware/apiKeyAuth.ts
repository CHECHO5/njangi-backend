import type { FastifyRequest, FastifyReply } from "fastify";

export async function apiKeyAuth(req: FastifyRequest, reply: FastifyReply) {
  const expected = process.env.API_KEY;
  const provided = (req.headers["x-api-key"] as string | undefined) ?? "";

  if (!expected) {
    return reply.code(500).send({ error: "API_KEY not set in environment" });
  }
  if (provided !== expected) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}
