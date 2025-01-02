import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const certificateRegisterApi = createApi({
  reducerPath: "certificateRegisterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7112/api/",
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