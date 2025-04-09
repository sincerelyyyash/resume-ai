
import RateLimit from "@/models/rateLimit.model";
import dbConnect from "@/lib/mongoDbConnect";

export const checkRateLimit = async ({
  ip,
  endpoint,
  limit,
  windowMs,
}: {
  ip: string;
  endpoint: string;
  limit: number;
  windowMs: number;
}) => {
  await dbConnect();

  const windowStart = new Date(Date.now() - windowMs);

  const recentRequests = await RateLimit.find({
    ip,
    endpoint,
    timestamp: { $gte: windowStart },
  });

  if (recentRequests.length >= limit) {
    return { allowed: false };
  }

  await RateLimit.create({ ip, endpoint });
  return { allowed: true };
};
