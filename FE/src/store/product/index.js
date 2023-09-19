import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const product = createSlice({
  name: 'product',
  initialState: {
    isLoading: false,
    products: [],
    product: {},
    detailId : ''
  },
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload
    },
    setDetailProduct: (state, action) => {
      state.product = action.payload
    },
    setDetailId: (state, action) => {
      state.detailId = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    update: (state, action) => {
      state.product = { ...state.product, ...action.payload }    
    },
    deleteProduct: (state, action) => {
      state.products.data = state.products?.data?.filter(product => product.id !== action.payload)
    }
  }
})

export const getProducts = (showentry, page) => async (dispatch) => {
  try {
    const { actions } = product
    const token = sessionStorage.getItem("token")
    const { data } = await axios.get(`http://localhost:7009/api/v1/product?showentry=${showentry}&page=${page}&key=id&order=desc`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    dispatch(actions.setProduct(data?.data))
  } catch (error) {
    console.log(error)      
  }
}

export const { setLoading, setProduct, setDetailOrder, setDetailId, setDetailProduct, update, deleteProduct} = product.actions
export default product.reducer