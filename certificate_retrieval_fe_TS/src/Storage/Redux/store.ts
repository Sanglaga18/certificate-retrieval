import { configureStore } from "@reduxjs/toolkit";
import { diplomaRegisterReducer } from "./diplomaRegisterSlice";
import {
  authApi,
  diplomaRegisterApi,
  certificateRegisterApi,
  courseApi,
  enrollmentApi,
  certificateApi,
  examApi,
  examResultApi,
  diplomaApi,
  userApi,
  studentApi,
} from "../../Apis";
import { userAuthReducer } from "./userAuthSlice";
import { certificateRegisterReducer } from "./certificateRegisterSlice";
import { courseReducer } from "./courseSlice";
import { enrollmentReducer } from "./enrollmentSlice";
import { certificateReducer } from "./certificateSlice";
import { examReducer } from "./examSlice";
import { examResultReducer } from "./examResultSlice";
import { diplomaReducer } from "./diplomaSlice";
import { userReducer } from "./userSlice";
import { studentReducer } from "./studentSlice";
const store = configureStore({
  reducer: {
    diplomaRegisterStore: diplomaRegisterReducer,
    certificateRegisterStore: certificateRegisterReducer,
    userAuthStore: userAuthReducer,
    courseStore: courseReducer,
    enrollmentStore: enrollmentReducer,
    certificateStore: certificateReducer,
    examStore: examReducer,
    examResultStore: examResultReducer,
    diplomaStore: diplomaReducer,
    userStore: userReducer,
    studentStore: studentReducer,
    [diplomaRegisterApi.reducerPath]: diplomaRegisterApi.reducer,
    [certificateRegisterApi.reducerPath]: certificateRegisterApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [enrollmentApi.reducerPath]: enrollmentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
    [examResultApi.reducerPath]: examResultApi.reducer,
    [diplomaApi.reducerPath]: diplomaApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(diplomaRegisterApi.middleware)
      .concat(certificateRegisterApi.middleware)
      .concat(courseApi.middleware)
      .concat(enrollmentApi.middleware)
      .concat(certificateApi.middleware)
      .concat(examApi.middleware)
      .concat(examResultApi.middleware)
      .concat(diplomaApi.middleware)
      .concat(userApi.middleware)
      .concat(studentApi.middleware)
      .concat(authApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
