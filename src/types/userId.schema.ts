import { z } from "zod";

export const userIdSchema = z.object({
  userId: z.string(),
});

