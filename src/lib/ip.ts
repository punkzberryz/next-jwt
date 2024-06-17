//user on server side only

import { headers } from "next/headers";

export function getIp() {
  let forwardedFor = headers().get("x-forwarded-for");
  let realIp = headers().get("x-real-ip");
  console.log({ forwardedFor, realIp });
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) return realIp.trim();
  return "0.0.0.0";
}
