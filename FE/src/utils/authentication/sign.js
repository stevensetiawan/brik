import axios from 'axios'
export const signingIn = async (email, password) => {
  const payload = {
    email,
    password
  }
  return await axios.post('http://localhost:7009/api/v1/user/login', payload)
    .then(response => {
      console.log(response,"ini response")
      return response
    })
    .catch(error => {
      throw new Error(error)
    })
}
