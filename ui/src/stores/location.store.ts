import { create } from "zustand";
import {Coordinate} from "@geo-cast/lib/dto/board/common";

export type LocationState = {
  coordinate: Coordinate | null;
};

export type LocationActions = {
  setCoordinate: (coordinate: Coordinate) => void,
  clearCoordinates: () => void
};

export const useLocationStore = create<LocationState & LocationActions>()((set) => ({
  coordinate: null,
  setCoordinate: (coordinate: Coordinate) => {
    set({ coordinate });
  },
  clearCoordinates: () => {
    set({ coordinate: null });
  }
}));
