"use client";

import { useAuthStore } from "@/hooks/store/auth/use-auth-store";
import { UserWithoutPassword } from "@/hooks/store/auth/user-slice";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useIsMounted } from "@/hooks/use-is-mounted";

/*  We fetch Auth from client side,
    because we want to avoid dynamic page if not necessary
 */
const AuthNav = () => {
  const { fetchUser, user } = useAuthStore();
  const isMounted = useIsMounted();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  if (!isMounted) return null;
  return (
    <div>
      {user?.id ? (
        <AuthNavDropdown user={user} />
      ) : (
        <Link href="/auth/signin">Sign in</Link>
      )}
    </div>
  );
};

const AuthNavDropdown = ({ user }: { user: UserWithoutPassword }) => {
  const { clearUser } = useAuthStore();
  const handleSignOut = () => {
    fetch("/api/auth/signout", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) return;
        clearUser();
      })
      .catch(console.error);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{user.displayName}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/auth/me">Me</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthNav;
