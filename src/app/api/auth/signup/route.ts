import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse, catchRouteErrorHelper } from "../../helper";
import { prismadb } from "@/lib/prisma-db";
import bcrypt from "bcryptjs";
import { createNewAccessToken } from "@/lib/token";
import { cookies } from "next/headers";
import cookie from "cookie";

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      displayName,
    }: { email?: string; password?: string; displayName?: string } =
      await req.json();
    if (!email || !password || !displayName) {
      return apiErrorResponse({
        message: "Email or password or displayName is missing",
        statusCode: 400,
        statusText: "Bad Request",
      });
    }
    // Your signup logic here
    const existedUser = await prismadb.user.findFirst({
      where: {
        email,
      },
    });
    if (existedUser) {
      return apiErrorResponse({
        message: "User existed",
        statusCode: 400,
        statusText: "Bad Request",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await prismadb.user.create({
      data: {
        email,
        hashedPassword,
        displayName,
      },
    });

    // create token session
    const { accessToken, refreshToken, sessionId } = await createNewAccessToken(
      {
        user,
        clientIp: req.ip ?? "",
      }
    );

    // set cookie
    const cookieValue = cookie.serialize(
      "token",
      JSON.stringify({ accessToken, refreshToken })
    );
    cookies().set("jwt-store", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // path: "/api/auth",
      path: "/",
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60 * 24 * 30 * 3, // 3 months
    });

    return NextResponse.json(
      { accessToken, refreshToken, sessionId },
      { status: 200 }
    );
  } catch (err) {
    return catchRouteErrorHelper(err, "GET api/auth/signup");
  }
}
