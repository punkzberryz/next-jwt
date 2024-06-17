import { getTokenCookie } from "@/lib/token/token-cookie";
import { NextRequest, NextResponse } from "next/server";
import { catchRouteErrorHelper } from "../../helper";
import { verifyToken } from "@/lib/token";
import { prismadb } from "@/lib/prisma-db";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenCookie();
    if (!token) {
      return NextResponse.json({}); // Return empty object if no token
    }
    const payload = verifyToken(token.accessToken);
    const user = await prismadb.user.findUnique({
      where: {
        id: payload.user.id,
      },
    });
    if (!user) {
      return NextResponse.json({}); // Return empty object if no token
    }
    return NextResponse.json({
      user: {
        ...user,
        hashedPassword: undefined,
      },
    });
  } catch (err) {
    return catchRouteErrorHelper(err, "/auth/me - GET");
  }
}
