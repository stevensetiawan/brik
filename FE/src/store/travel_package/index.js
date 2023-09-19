import { createSlice } from '@reduxjs/toolkit'
import axios from 'utils/axios'
const travel_package = createSlice({
  name: 'travel_package',
  initialState: {
    totalNews: 0,
    isLoading: false,
    packages: [],
    singlePackage: {},
    higlightNews: {},
    params: {
      sources: 'fullcomment',
      limit: 10,
      offset: 0
    },
    pickPackage: {},
    keywords: ''
  },
  reducers: {
    setNews: (state, action) => {
      state.packages = action.payload
    },
    setHighLight: (state, action) => {state.higlightNews = action.payload[0]},
    setSinglePackage: (state, action) => {state.singlePackage = action.payload},
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setTotalNews: (state, action) => {
      state.totalNews = action.payload
    },
    setKeyword: (state, action) => {
      state.keywords = action.payload
    },
    selectPackage: (state, action) => {
      state.pickPackage = action.payload
    }
  }
})

export const getNewsMediastack = () => async (dispatch) => {
  const { actions } = travel_package
  dispatch(actions.setLoading(true))
    await axios
    .get('')
    .then(({ data }) => {
      dispatch(actions.setNews(data))
      if (data && data.length > 0) {
        dispatch(actions.setHighLight(data))
      }      
      dispatch(actions.setLoading(false))
    })
    .catch(() => {
      dispatch(actions.setLoading(false))
    })
}
export const { setNews, setSingleNews, selectPackage, setKeyword } = travel_package.actions
export default travel_package.reducer
