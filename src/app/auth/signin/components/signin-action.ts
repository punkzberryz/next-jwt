"use server";

import { catchErrorForServerActionHelper } from "@/lib/error/catch-error-action-helper";
import { SignInSchema } from "./signin-form";
import { BadRequestError, UnauthorizedError } from "@/lib/error/model";
import { prismadb } from "@/lib/prisma-db";
import bcrypt from "bcryptjs";
import { getIp } from "@/lib/ip";
import { createNewAccessToken } from "@/lib/token";
import { setTokenCookie } from "@/lib/token/token-cookie";

export const signInUser = async ({ email, password }: SignInSchema) => {
  try {
    if (!email || !password) {
      throw new BadRequestError("Email or password is missing");
    }
    const user = await prismadb.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedError("email or password is incorrect");
    }
    //check password
    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      throw new UnauthorizedError("email or password is incorrect");
    }
    //create token session
    const clientIp = getIp();
    const { accessToken, refreshToken } = await createNewAccessToken({
      user,
      clientIp,
    });

    //set cookie
    setTokenCookie({ accessToken, refreshToken });
    //return response
    return { user };
  } catch (err) {
    const error = catchErrorForServerActionHelper(err);
    return {
      error,
    };
  }
};
