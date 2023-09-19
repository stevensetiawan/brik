import { createSlice } from '@reduxjs/toolkit'
const sidePanel = createSlice({
  name: 'sidePanel',
  initialState: { isOpen: false },
  reducers: {
    setSidePanel: (state, action) => {
      state.isOpen = action.payload
    }
  }
})
export const { setSidePanel } = sidePanel.actions
export default sidePanel.reducer
