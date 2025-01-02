import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  diploma: [],
  diplomaNumber: undefined,
};
export const diplomaSlice = createSlice({
  name: "Diploma",
  initialState: initialState,
  reducers: {
    setDiploma: (state, action) => {
      state.diploma = action.payload;
    },
    setDiplomaNumber: (state, action) => {
      state.diplomaNumber = action.payload;
    },
    clearDiplomaNumber: (state) => {
      state.diplomaNumber = undefined;
    },
  },
});
export const { setDiploma, setDiplomaNumber, clearDiplomaNumber } =
  diplomaSlice.actions;
export const diplomaReducer = diplomaSlice.reducer;
