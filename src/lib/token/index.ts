import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { createId } from "@paralleldrive/cuid2";
import { prismadb } from "../prisma-db";
import { config } from "../config";
import { UnauthorizedError } from "../error/model";
import { catchErrorForServerActionHelper } from "../error/catch-error-action-helper";

interface UserPayload extends Partial<User> {
  id: string;
  email: string;
  displayName: string | null;
}
type Payload = {
  id: string;
  user: UserPayload;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
  aud?: string;
};

function createToken(payload: Payload, secret: string, expiresIn: string) {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
}

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "1y";
export async function createNewAccessToken({
  user,
  clientIp,
}: {
  user: User;
  clientIp: string;
}) {
  const [accessTokenId, refreshTokenId] = [createId(), createId()];
  const userPayload: UserPayload = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  };

  const accessToken = createToken(
    {
      user: userPayload,
      id: accessTokenId,
    },
    config.jwtSecret,
    ACCESS_TOKEN_EXPIRES_IN
  );
  const refreshToken = createToken(
    {
      user: userPayload,
      id: refreshTokenId,
    },
    config.jwtSecret,
    REFRESH_TOKEN_EXPIRES_IN
  );

  const session = await prismadb.session.create({
    data: {
      id: refreshTokenId,
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      clientIp: clientIp,
    },
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session.id,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = verifyToken(refreshToken);
    const session = await prismadb.session.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!session) {
      throw new UnauthorizedError("Invalid session");
    }
    if (session.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    const accessToken = createToken(
      {
        user: payload.user,
        id: createId(),
      },
      config.jwtSecret,
      ACCESS_TOKEN_EXPIRES_IN
    );
    return accessToken;
  } catch (err) {
    throw err;
  }
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as Payload;
    return payload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("token expired");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("invalid token");
    }
    if (err instanceof jwt.NotBeforeError) {
      throw new UnauthorizedError("token not active");
    }
    throw new UnauthorizedError("invalid token");
  }
}
