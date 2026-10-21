import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { randomPaint, type CarPaint } from "./paints";
import type { ServiceId, ServiceMode } from "./data";
export interface BookingState {
  paint: CarPaint;
  mode: ServiceMode;
  service: ServiceId;
  vehicleType: string;
  vehicle: string;
  neighbourhood: string;
  axles: number;
}
const initialState: BookingState = {
  paint: randomPaint(),
  mode: "oil",
  service: "o2",
  vehicleType: "Car / Sedan",
  vehicle: "",
  neighbourhood: "",
  axles: 1,
};
const slice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setMode(s, a: PayloadAction<ServiceMode>) {
      s.mode = a.payload;
      s.service = a.payload === "oil" ? "o2" : "b2";
    },
    update(s, a: PayloadAction<Partial<BookingState>>) {
      Object.assign(s, a.payload);
    },
  },
});
export const { setMode, update } = slice.actions;
export const store = configureStore({ reducer: { booking: slice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
