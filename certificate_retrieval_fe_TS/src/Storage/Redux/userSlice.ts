import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: [],
};
export const userSlice = createSlice({
  name: "User",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});
export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
