import { create } from "zustand";
import { CoordinateType } from "../types";

export type LocationState = {
  coordinate: CoordinateType | null;
};

export type LocationActions = {
  setCoordinate: (coordinate: CoordinateType) => void
};

export const useLocationStore = create<LocationState & LocationActions>()((set) => ({
  coordinate: null,
  setCoordinate: (coordinate: CoordinateType) => {
    set({ coordinate });
  }
}));
