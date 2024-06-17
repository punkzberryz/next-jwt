import { User } from "@prisma/client";
import { StateCreator } from "zustand";

// userSlice stores the user data
export type UserWithoutPassword = Omit<User, "hashedPassword">;
export type UserSlice = {
  user: UserWithoutPassword | null;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
};

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (
  set
) => ({
  user: null,
  clearUser: () => set((state) => ({ user: null })),
  fetchUser: async () => {
    const response = await fetch("/api/auth/me", {
      cache: "no-store",
    });
    if (!response.ok) {
      return;
    }
    const { user }: { user?: UserWithoutPassword } = await response.json();
    if (user) set(() => ({ user }));
    return;
  },
});
