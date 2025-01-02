import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  certificate: [],
  certificateID: undefined,
};
export const certificateSlice = createSlice({
  name: "Certificate",
  initialState: initialState,
  reducers: {
    setCertificate: (state, action) => {
      state.certificate = action.payload;
    },
    setCertificateID: (state, action) => {
      state.certificateID = action.payload;
    },
    clearCertificateID: (state) => {
      state.certificateID = undefined;
    },
  },
});
export const { setCertificate, setCertificateID, clearCertificateID } =
  certificateSlice.actions;
export const certificateReducer = certificateSlice.reducer;
