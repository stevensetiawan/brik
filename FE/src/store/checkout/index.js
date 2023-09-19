import { createSlice } from '@reduxjs/toolkit'

const checkout = createSlice({
  name: 'checkout',
  initialState: {
    isLoading: false,
    pickCheckout: {},
    detailPayment:{
      total_price: 0,
      qty: 1,
      package_id: ''
    }
  },
  reducers: {
    selectCheckout: (state, action) => {
      state.pickCheckout = action.payload
    },
    setPayment: (state, action) => {
      state.detailPayment.qty = action.payload.payload
    }
  }
})

export const { selectCheckout, payCheckout, setPayment } = checkout.actions
export default checkout.reducer