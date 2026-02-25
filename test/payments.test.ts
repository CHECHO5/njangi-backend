import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app.js";

let app: Awaited<ReturnType<typeof buildApp>>;

const API_KEY = process.env.API_KEY ?? "njangi_dev_123456";

describe("Payments API", () => {
  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health returns ok:true", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  it("GET /payments requires API key", async () => {
    const res = await app.inject({ method: "GET", url: "/payments" });
    expect(res.statusCode).toBe(401);
  });

  it("GET /payments works with API key", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/payments",
      headers: { "x-api-key": API_KEY },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  it("POST /payments/create creates a transaction", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/payments/create",
      headers: {
        "x-api-key": API_KEY,
        "content-type": "application/json",
      },
      payload: {
        groupId: "g1",
        memberId: "m1",
        amountMinor: 100,
        currency: "USD",
        provider: "stripe",
      },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("transaction");
    expect(body.transaction).toHaveProperty("id");
    expect(body.transaction.groupId).toBe("g1");
  });

  it("GET /payments/transactions returns items array", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/payments/transactions",
      headers: { "x-api-key": API_KEY },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);
  });
});
