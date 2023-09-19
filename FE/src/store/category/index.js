import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const account = createSlice({
  name: 'category',
  initialState: {
    isLoading: false,
    categories: []
  },
  reducers: {
    setCategory: (state, action) => {
      state.categories = action.payload
    },
    setLoadingCategory: (state, action) => {
      state.isLoading = action.payload
    }
  }
})

export const getCategories = () => async (dispatch) => {
  try {
    const { actions } = account
    const token = sessionStorage.getItem("token")
   
    const { data } = await axios.get(`http://localhost:7009/api/v1/category`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    dispatch(actions.setCategory(data))
  } catch (error) {
    console.log(error)      
  }
}

export const { setLoadingCategory, setCategory } = account.actions
export default account.reducer