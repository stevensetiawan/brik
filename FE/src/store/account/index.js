import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const account = createSlice({
  name: 'account',
  initialState: {
    isLoading: false,
    customers: [],
    detailId : '',
    detailCustomer: {}
  },
  reducers: {
    selectCheckout: (state, action) => {
      state.pickCheckout = action.payload
    },
    setCustomer: (state, action) => {
      state.customers = action.payload
    },
    setDetailCustomer: (state, action) => {
      state.detailCustomer = action.payload
    },
    setDetailId: (state, action) => {
      state.detailId = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    update: (state, action) => {
      state.detailCustomer = { ...state.detailCustomer, ...action.payload }    
    },
    deleteAccount: (state, action) => {
      const newAccount = state.customers.filter(customer => customer.id !== action.payload)
      // "Mutate" the existing state to save the new array
      state.customers = newAccount
    }  
  }
})

export const getCustomers = () => async (dispatch) => {
  try {
    const { actions } = account
    const token = sessionStorage.getItem("token")
   
    const { data } = await axios.get(`http://localhost:3002/api/v1/customer`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    dispatch(actions.setCustomer(data))
  } catch (error) {
    console.log(error)      
  }
}

export const { setLoading, setCustomer, setDetailCustomer, setDetailId, deleteAccount, update} = account.actions
export default account.reducer