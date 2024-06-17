import { getTokenCookie, removeTokenCookie } from "@/lib/token/token-cookie";
import { catchRouteErrorHelper } from "../../helper";
import { UnauthorizedError } from "@/lib/error/model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tokenResp = getTokenCookie();
    if (!tokenResp) throw new UnauthorizedError("token not found");
    removeTokenCookie();
    return NextResponse.json({});
  } catch (err) {
    return catchRouteErrorHelper(err, "/api/auth/signout - GET");
  }
}
