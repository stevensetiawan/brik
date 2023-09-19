import Router from './router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"
import { logout, token } from 'store/authentication'
function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const token2 = sessionStorage.getItem("token")
    if(token2) {
      const decoded = jwt_decode(JSON.stringify(token2))
      if (decoded.exp * 1000 > Date.now()) {
        dispatch(token())
      } else {
        dispatch(logout())
        navigate('/')
      }
    }
  }, [])
  return (
    <>
      <Router />
    </>
  )
}

export default App
