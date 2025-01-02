import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  course: [],
};
export const courseSlice = createSlice({
  name: "Course",
  initialState: initialState,
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
    },
  },
});
export const { setCourse } = courseSlice.actions;
export const courseReducer = courseSlice.reducer;
