import axios from 'axios'

export const signingOut = async () => {
  return await axios.post('http://localhost:7009/api/v1/user/logout')
    .then(response => {
      return response
    })
    .catch(error => {
      throw new Error(error)
    })
}
