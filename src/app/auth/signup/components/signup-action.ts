"use server";

import { SignUpSchema } from "./signup-form";
import { catchErrorForServerActionHelper } from "@/lib/error/catch-error-action-helper";
import { BadRequestError } from "@/lib/error/model";
import { prismadb } from "@/lib/prisma-db";
import bcrypt from "bcryptjs";
import { createNewAccessToken } from "@/lib/token";
import { setTokenCookie } from "@/lib/token/token-cookie";
import { getIp } from "@/lib/ip";

export const signUpUser = async ({
  email,
  displayName,
  password,
}: SignUpSchema) => {
  try {
    if (!email || !displayName || !password) {
      throw new BadRequestError("Email or password or displayName is missing");
    }
    const existedUser = await prismadb.user.findFirst({
      where: { email },
    });
    if (existedUser) {
      throw new BadRequestError("User existed");
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
