import { NextRequest, NextResponse } from "next/server";
import { getTokenCookie } from "./lib/token/token-cookie";

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  // check if token is expired

  const token = getTokenCookie();
  if (!token || !token?.accessToken) {
    //no token found, proceed to next
    return response;
  }
  response.headers.set("Authorization", `Bearer ${token.accessToken}`);
  return response;
}
