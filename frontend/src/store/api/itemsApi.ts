import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_BASE_URL } from '@/lib/config'
import type { Item, ItemCreateInput, ItemUpdateInput } from '@/types/item'

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    listItems: builder.query<Item[], void>({
      query: () => '/items',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Item' as const, id })),
              { type: 'Item', id: 'LIST' },
            ]
          : [{ type: 'Item', id: 'LIST' }],
    }),
    getItem: builder.query<Item, string>({
      query: (id) => `/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Item', id }],
    }),
    createItem: builder.mutation<Item, ItemCreateInput>({
      query: (body) => ({
        url: '/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Item', id: 'LIST' }],
    }),
    updateItem: builder.mutation<Item, { id: string; body: ItemUpdateInput }>({
      query: ({ id, body }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Item', id },
        { type: 'Item', id: 'LIST' },
      ],
    }),
    deleteItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Item', id },
        { type: 'Item', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useListItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi
