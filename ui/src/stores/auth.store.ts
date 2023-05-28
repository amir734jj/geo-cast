import { UserType } from "../../../lib/dtos/account";
import store from 'store';
import { create } from "zustand";

export type AuthState = {
  auth: UserType | null;
  token: string | null;
};

export type AuthActions = {
  login: (user: UserType) => void,
  logout: () => void,
  setToken: (token: string) => void,
};

const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  auth: null,
  token: null,
  setToken: (token: string) => {
    set({ token });
    store.set("token", token);
  },
  login: (user) => {
    set({ auth: user });
  },
  logout: () => {
    store.remove("token");
    set({ auth: null, token: null });
  },
}));

export default useAuthStore;
