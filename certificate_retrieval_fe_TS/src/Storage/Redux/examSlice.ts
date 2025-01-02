import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  exam: [],
};
export const examSlice = createSlice({
  name: "Exam",
  initialState: initialState,
  reducers: {
    setExam: (state, action) => {
      state.exam = action.payload;
    },
  },
});
export const { setExam } = examSlice.actions;
export const examReducer = examSlice.reducer;
