import { z } from "zod";

export const CreatePaymentRequestSchema = z.object({
  groupId: z.string().min(1),
  memberId: z.string().min(1).optional(),
  amountMinor: z.number().int().positive(),
  currency: z.string().min(3).max(10),
  provider: z.string().min(1),
});

export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>;
