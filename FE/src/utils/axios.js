import axios from 'axios'
const api = axios.create({
  baseURL:  'http://localhost:3002/api/v1/package/'
})
export const apiKey = {
  access_key: process.env.REACT_APP_MEDIASTACK_APIKEY
}
export default api
