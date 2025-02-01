import { headers } from "next/headers";

export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const vercelForwardedFor = headersList.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) return vercelForwardedFor;

  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIP = headersList.get("x-real-ip");
  if (realIP) return realIP;

  return "unknown";
}

