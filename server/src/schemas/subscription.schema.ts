import { z } from "zod";

export const subscribeSchema = z.object({
  params: z.object({
    planId: z.string().uuid(),
  }),
});