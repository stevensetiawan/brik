import {
  createSlice
} from '@reduxjs/toolkit'
import jwt_decode from "jwt-decode";
const authentication = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    isAdmin: false
  },
  reducers: {
    token: state => {
      const token = sessionStorage.getItem("token")
      if (token) {
        const decoded = jwt_decode(JSON.stringify(token))    
        state.isAdmin = decoded.user.role === 'admin' ? true : false
        state.isLogin = true
      }
    },
    logout: state => {
      const token = sessionStorage.getItem("token")
      if (!token) {
      state.isLogin = false
      }
    }
  }
})
export const {
  token,
  logout
} = authentication.actions
export default authentication.reducer