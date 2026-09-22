import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ItemDialogMode = 'create' | 'edit' | null

interface AppState {
  itemDialogMode: ItemDialogMode
  editingItemId: string | null
}

const initialState: AppState = {
  itemDialogMode: null,
  editingItemId: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openCreateItemDialog(state) {
      state.itemDialogMode = 'create'
      state.editingItemId = null
    },
    openEditItemDialog(state, action: PayloadAction<string>) {
      state.itemDialogMode = 'edit'
      state.editingItemId = action.payload
    },
    closeItemDialog(state) {
      state.itemDialogMode = null
      state.editingItemId = null
    },
  },
})

export const { openCreateItemDialog, openEditItemDialog, closeItemDialog } =
  appSlice.actions

export default appSlice.reducer
