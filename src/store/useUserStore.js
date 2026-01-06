import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { updateUser as apiUpdateUser } from "../common/services/user.service";

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        tickets: [],
        setProfile: (profile) =>
          set({ profile, tickets: profile?.tickets ? profile.tickets : [] }),
        updateProfile: async (payload) => {
          const { tickets: currentTickets } = get();
          const res = await apiUpdateUser(payload);
          if (res?.data) {
            // Preserve tickets: prefer returned tickets, otherwise keep existing
            const returnedTickets = res.data.tickets;
            set({
              profile: res.data,
              tickets: returnedTickets ? returnedTickets : currentTickets,
            });
          }
          return res;
        },
        addTicket: (ticket) => {
          const { tickets } = get();
          const next = [ticket, ...tickets];
          set({ tickets: next });
        },
        clear: () => set({ profile: null, tickets: [] }),
      }),
      { name: "user-storage" },
    ),
    { name: "userStore" },
  ),
);

export const useUserSelector = (selector) => useUserStore(useShallow(selector));

export default useUserStore;
