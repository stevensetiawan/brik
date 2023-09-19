import { createSlice } from '@reduxjs/toolkit'
const snackbars = createSlice({
  name: 'snackbars',
  initialState: {
    isOpen: false,
    message: '',
    severity: 'info', // success| error| warning|info
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    },
    autoHideDuration: 6000
  },
  reducers: {
    handleClick: (state, action) => {
      state.message = action.payload.message
      state.severity = action.payload.severity
      state.isOpen = true
    },
    handleClose: state => {
      state.isOpen = false
    }
  }
})
export const { handleClick, handleClose } = snackbars.actions
export default snackbars.reducer
