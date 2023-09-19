import axios from 'axios'

export const signingUp = async (payload) => {
  console.log(payload, 'ini payload')
  return await axios.post('http://localhost:7009/api/v1/user/register', payload)
  .then(response => {
    console.log(response,"ini response")
    return response
  })
  .catch(error => {
    throw new Error(error)
  })
}