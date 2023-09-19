import axios from 'axios'

export const signingUp = async (payload) => {
  return await axios.post('http://localhost:7009/api/v1/user/register', payload)
  .then(response => {
    return response
  })
  .catch(error => {
    throw new Error(error)
  })
}