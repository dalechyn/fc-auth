"use client";

import { type PollChannelTillCompletedReturnType } from "@fc-auth/core";
import { create } from "zustand";

export type Profile = Pick<
  PollChannelTillCompletedReturnType,
  "fid" | "pfpUrl" | "username" | "displayName" | "bio" | "custody" | "verifications"
> & { isAuthenticated: boolean };

type ProfileStore = { profile: Profile | undefined; set: (profile: Profile) => void; reset: () => void };

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: undefined,
  set: (profile) => set({ profile }),
  reset: () => set({ profile: undefined }),
}));

export function useProfile() {
  return useProfileStore(({ profile }) => profile);
}

export default useProfile;
