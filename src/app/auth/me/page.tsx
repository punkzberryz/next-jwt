import { UserWithoutPassword } from "@/hooks/store/auth/user-slice";
import { UnauthorizedError } from "@/lib/error/model";
import { prismadb } from "@/lib/prisma-db";
import { verifyToken } from "@/lib/token";
import { getTokenFromHeader } from "@/lib/token/token-cookie";

const MePage = async () => {
  const token = getTokenFromHeader();
  if (!token) {
    throw new UnauthorizedError("No token found");
  }
  let user: UserWithoutPassword;
  try {
    const payload = verifyToken(token);
    const userResp = await prismadb.user.findUnique({
      where: { id: payload.user.id },
    });
    if (!userResp) {
      throw new UnauthorizedError("User not found");
    }
    user = {
      id: userResp.id,
      displayName: userResp.displayName,
      email: userResp.email,
      createdAt: userResp.createdAt,
      updatedAt: userResp.updatedAt,
    };
  } catch (err) {
    throw err;
  }

  return (
    <div>
      <h1>My page</h1>
      <div className="max-w-[350px]">
        <div className="grid grid-cols-2">
          <p className="text-muted-foreground font-semibold">id: </p>
          <p className="font-semibold">{user.id}</p>
        </div>
        <div className="grid grid-cols-2">
          <p className="text-muted-foreground font-semibold">DisplayName: </p>
          <p className="font-semibold">{user.displayName}</p>
        </div>
        <div className="grid grid-cols-2">
          <p className="text-muted-foreground font-semibold">Email: </p>
          <p className="font-semibold">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default MePage;
