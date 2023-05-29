import { UserType } from "../../../lib/dto/account";
import store from 'store';
import { create } from "zustand";

export type AuthState = {
  auth: UserType | null;
  token: string | null;
};

export type AuthActions = {
  setUser: (user: UserType) => void,
  logout: () => void,
  setToken: (token: string) => void
};

const useAuthStore = create<AuthState & AuthActions>()((set) => ({
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

export default useAuthStore;
