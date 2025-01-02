import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  examResult: [],
};
export const examResultSlice = createSlice({
  name: "ExamResult",
  initialState: initialState,
  reducers: {
    setExamResult: (state, action) => {
      state.examResult = action.payload;
    },
  },
});
export const { setExamResult } = examResultSlice.actions;
export const examResultReducer = examResultSlice.reducer;
