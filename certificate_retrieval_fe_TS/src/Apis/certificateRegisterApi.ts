import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const certificateRegisterApi = createApi({
  reducerPath: "certificateRegisterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers: Headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.append("Authorization", "Bearer " + token);
      }
      return headers;
    },
  }),
  tagTypes: ["Certificate-Register"],
  endpoints: (builder) => ({
    getCertificateRegister: builder.query({
      query: () => ({
        url: "certificate-register",
      }),
      providesTags: ["Certificate-Register"],
    }),
    getCertificateRegisterById: builder.query({
      query: (id) => ({
        url: `certificate-register/${id}`,
      }),
      providesTags: ["Certificate-Register"],
    }),
    createCertificateRegister: builder.mutation({
      query: (data) => ({
        url: "certificate-register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Certificate-Register"],
    }),
    updateCertificateRegister: builder.mutation({
      query: ({ data, id }) => ({
        url: "certificate-register/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Certificate-Register"],
    }),
    deleteCertificateRegister: builder.mutation({
      query: (id) => ({
        url: "certificate-register/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificate-Register"],
    }),
  }),
});
export const {
  useGetCertificateRegisterQuery,
  useGetCertificateRegisterByIdQuery,
  useCreateCertificateRegisterMutation,
  useUpdateCertificateRegisterMutation,
  useDeleteCertificateRegisterMutation,
} = certificateRegisterApi;
export default certificateRegisterApi;
