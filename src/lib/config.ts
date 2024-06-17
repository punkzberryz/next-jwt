export const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET!,
};
