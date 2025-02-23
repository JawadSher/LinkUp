import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',

    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.user?.accessToken;
    //   if (token) {
    //     headers.set('Authorization', `Bearer ${token}`);
    //   }
    //   return headers;
    // },

  }),

  tagTypes: ['User', 'Posts'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),

    // getPosts: builder.query({
    //   query: () => '/posts',
    //   providesTags: ['Posts'],
    // }),

    // updateUser: builder.mutation({
    //   query: (userData) => ({
    //     url: '/user/update',
    //     method: 'PUT',
    //     body: userData,
    //   }),
    //   invalidatesTags: ['User'],
    // }),
  }),
});

export const { useGetUserQuery } = apiSlice;

export default apiSlice;
