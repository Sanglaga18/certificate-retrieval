import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  student: [],
};
export const studentSlice = createSlice({
  name: "Student",
  initialState: initialState,
  reducers: {
    setStudent: (state, action) => {
      state.student = action.payload;
    },
  },
});
export const { setStudent } = studentSlice.actions;
export const studentReducer = studentSlice.reducer;
