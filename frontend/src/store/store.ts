import { configureStore } from '@reduxjs/toolkit'

import recipeGeneratorReducer from '@/store/slices/recipeGeneratorSlice'

export const store = configureStore({
  reducer: {
    recipeGenerator: recipeGeneratorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
