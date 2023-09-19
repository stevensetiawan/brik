import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const order = createSlice({
  name: 'order',
  initialState: {
    isLoading: false,
    orders: [],
    products: [],
    customers: [],
    allOrders: [],
    detailId : '',
    detailOrder: {}
  },
  reducers: {
    selectCheckout: (state, action) => {
      state.pickCheckout = action.payload
    },
    setOrder: (state, action) => {
      state.orders = action.payload
    },
    setProduct: (state, action) => {
      state.products = action.payload
    },
    setCustomer: (state, action) => {
      state.customers = action.payload
    },
    setAllOrder: (state, action) => {
      state.allOrders = action.payload
    },
    setDetailOrder: (state, action) => {
      state.detailOrder = action.payload
    },
    setDetailId: (state, action) => {
      state.detailId = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    update: (state, action) => {
      state.detailOrder = { ...state.detailOrder, ...action.payload }    
    },
    deleteOrder: (state, action) => {
      const newOrder = state.orders.filter(order => order.id !== action.payload)
      // "Mutate" the existing state to save the new array
      state.orders = newOrder
    }  
  }
})

export const getOrders = () => async (dispatch) => {
  try {
    const { actions } = order
    const token = sessionStorage.getItem("token")
    
    const { data } = await axios.get(`http://localhost:3002/api/v1/order`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    dispatch(actions.setOrder(data))
  } catch (error) {
    console.log(error)      
  }
}

export const { setLoading, setOrder, setDetailOrder, setDetailId, deleteOrder, update, setProduct, setCustomer} = order.actions
export default order.reducer