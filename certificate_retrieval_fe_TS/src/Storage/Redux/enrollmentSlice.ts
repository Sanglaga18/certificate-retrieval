import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  enrollment: [],
};
export const enrollmentSlice = createSlice({
  name: "Enrollment",
  initialState: initialState,
  reducers: {
    setEnrollment: (state, action) => {
      state.enrollment = action.payload;
    },
  },
});
export const { setEnrollment } = enrollmentSlice.actions;
export const enrollmentReducer = enrollmentSlice.reducer;
