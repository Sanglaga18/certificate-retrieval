import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  certificateRegister: [],
};
export const certificateRegisterSlice = createSlice({
  name: "CertificateRegister",
  initialState: initialState,
  reducers: {
    setCertificateRegister: (state, action) => {
      state.certificateRegister = action.payload;
    },
  },
});
export const { setCertificateRegister } = certificateRegisterSlice.actions;
export const certificateRegisterReducer = certificateRegisterSlice.reducer;
