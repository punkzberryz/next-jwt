import { NextRequest, NextResponse } from "next/server";
import { catchRouteErrorHelper } from "../../helper";
import { getTokenCookie, setTokenCookie } from "@/lib/token/token-cookie";
import { UnauthorizedError } from "@/lib/error/model";
import { refreshAccessToken } from "@/lib/token";

export async function GET(req: NextRequest) {
  try {
    const tokenResp = getTokenCookie();
    if (!tokenResp) throw new UnauthorizedError("Token not found");

    // refresh accessToken
    const accessToken = await refreshAccessToken(tokenResp.refreshToken);

    // set new cookie
    setTokenCookie({ accessToken, refreshToken: tokenResp.refreshToken });
    return NextResponse.json({});
  } catch (err) {
    return catchRouteErrorHelper(err, "/auth/token - GET");
  }
}
