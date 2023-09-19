import { createSlice } from '@reduxjs/toolkit'
const modal = createSlice({
  name: 'modal',
  initialState: {
    isModalOpen: false,
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3
    }
  },
  reducers: {
    handleModalClick: state => {
      state.isModalOpen = true
    },
    handleModalClose: state => {
      state.isModalOpen = false
    }
  }
})
export const { handleModalClick, handleModalClose } = modal.actions
export default modal.reducer
