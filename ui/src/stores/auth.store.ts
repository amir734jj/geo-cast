import { UserType } from "../../../lib/dto/account";
import store from 'store';
import { create } from "zustand";

export type AuthStateType = {
  auth: UserType | null;
  token: string | null;
};

export type AuthActionsType = {
  setUser: (user: UserType) => void,
  logout: () => void,
  setToken: (token: string) => void
};

export const useAuthStore = create<AuthStateType & AuthActionsType>()((set) => ({
  auth: null,
  token: store.get("token", null),
  setToken: (token: string) => {
    set({ token });
    store.set("token", token);
  },
  setUser: (user) => {
    set({ auth: user });
  },
  logout: () => {
    store.remove("token");
    set({ auth: null, token: null });
  }
}));
