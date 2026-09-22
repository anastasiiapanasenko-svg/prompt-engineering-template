import { configureStore } from '@reduxjs/toolkit'

import { itemsApi } from '@/store/api/itemsApi'
import appReducer from '@/store/slices/appSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(itemsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
