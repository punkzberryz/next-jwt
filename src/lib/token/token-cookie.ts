import { cookies, headers } from "next/headers";
import cookie from "cookie";

const TOKEN_KEY = "token-store";

export const setTokenCookie = ({
  accessToken,
  refreshToken,
}: TokenResponse) => {
  console.log("setting token cookie");
  const cookiesStore = cookies();
  const cookieValue = cookie.serialize(
    "token",
    JSON.stringify({ accessToken, refreshToken } as TokenResponse)
  );
  cookiesStore.set(TOKEN_KEY, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // path: "/api/auth",
    path: "/",
    // maxAge: 60 * 60 * 24 * 7, // 1 week
    maxAge: 60 * 60 * 24 * 30 * 3, // 3 months
  });
};

export const removeTokenCookie = () => {
  console.log("removing token cookie");
  const cookiesStore = cookies();
  cookiesStore.set(TOKEN_KEY, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // 3 months
  });
};

export const getTokenCookie = (): TokenResponse | null => {
  /* 
  getTokenCookie is only used in Api Route Handlers only
  DO NOT USE THIS IN SERVER SIDE RENDERING COMPONENTS
  because cookies may not be the latest.

  Latest cookies are only available in client side rendering components
  or from middleware.

  Since middleware cannot set cookies, we can only send cookies by setting
  it in the response header. Hence we only use getTokenFromHeader for SSR components

  Example for expired token: When user is logged in, but havn't visited the site for a long time
  the token will be expired (and client-side won't be able to refresh).
  In this case, middleware will renew the token and set it to the header. However,
  since middleware cannot set cookies, we will get old cookie if we use getTokenCookie.
  */

  const cookiesStore = cookies();
  const cookieValue = cookiesStore.get(TOKEN_KEY);
  if (cookieValue) {
    const result = cookie.parse(cookieValue.value);
    const token: TokenResponse = JSON.parse(result.token);
    return token;
  }
  return null;
};

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const getTokenFromHeader = () => {
  //get token from header after middleware is run
  //for server side rendering
  const headerList = headers();
  const authorization = headerList.get("authorization");
  if (!authorization) {
    return null;
  }
  const token = authorization?.split("Bearer ");
  if (token && token[1]) {
    return token[1];
  }
  return null;
};
