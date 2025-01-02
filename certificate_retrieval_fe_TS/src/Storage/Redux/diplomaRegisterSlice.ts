import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  diplomaRegister: [],
};
export const diplomaRegisterSlice = createSlice({
  name: "DiplomaRegister",
  initialState: initialState,
  reducers: {
    setDiplomaRegister: (state, action) => {
      state.diplomaRegister = action.payload;
    },
  },
});
export const { setDiplomaRegister } = diplomaRegisterSlice.actions;
export const diplomaRegisterReducer = diplomaRegisterSlice.reducer;
