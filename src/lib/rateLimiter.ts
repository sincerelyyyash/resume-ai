
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export const rateLimit = ({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) => {
  return (ip: string) => {
    const now = Date.now();
    const data = rateLimitMap.get(ip);

    if (!data || now - data.timestamp > windowMs) {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
      return { allowed: true };
    }

    if (data.count >= limit) {
      return { allowed: false };
    }

    data.count += 1;
    rateLimitMap.set(ip, data);
    return { allowed: true };
  };
};
