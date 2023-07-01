import { create } from "zustand";
import {Coordinate} from "@geo-cast/lib/dto/board/common";
import {LocationActions, LocationState} from "./location.store";

export const useMapFocusStore = create<LocationState & LocationActions>()((set) => ({
  coordinate: null,
  setCoordinate: (coordinate: Coordinate) => {
    set({ coordinate });
  },
  clearCoordinates: () => {
    set({ coordinate: null });
  }
}));
