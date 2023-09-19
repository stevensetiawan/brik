import { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardContent, TextField, CardActions, Button, Box, Container } from '@mui/material'
import { signingUp } from '../../utils/authentication/signup'
import { token } from 'store/authentication'
import logo from 'assets/images/PowerfulReasons_hero.jpeg'
import { handleClick } from 'store/snackbars'
import { useDispatch } from 'react-redux'

const initialForm = {
  email: String,
  name: String,
  phone: String,
  address: String,
  password: String,
  repassword: String
}
const fungsiFormReducer = (state, action) => {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.payload }
    case 'name':
      return { ...state, name: action.payload }
    case 'password':
      return { ...state, password: action.payload }
    case 'repassword':
      return { ...state, repassword: action.payload }
    case 'role':
      return { ...state, role: action.payload }
    case 'reset':
      return { ...initialForm }
    default:
      return state
  }
}
const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getForm, setForm] = useReducer(fungsiFormReducer, initialForm)
  const onChangerValue = event => setForm({ type: event.target?.id?.replace('id-', ''), payload: event.target.value })
  const onSubmitForm = event => {
    event.preventDefault()
    setForm({ type: 'reset' })
  }
  const signUp = async event => {
    try {
      event.preventDefault()
      const { email, password, repassword, name, role } = getForm

      if(password.length < 6){
        throw new Error(`Password minimum 6`)
      } else if (password === repassword) {
        const payload = {
          email,
          password,
          role,
          name
        }
        const response = await signingUp(payload)
        if (response) {
          sessionStorage.setItem("token", response?.data?.token)
          dispatch(token())
          dispatch(
            handleClick({
              message: 'Berhasi Register',
              severity: 'info'
            })
          )
          navigate('/')
        } else {
          dispatch(
            handleClick({
              message: 'Terjadi Kesalahan',
              severity: 'error'
            })
          )
        }
      } else {
        throw new Error(`Password isn't match`)
      }
    } catch (e) {
      dispatch(
        handleClick({
          message: `'error: '${e}`,
          severity: 'error'
        })
      )
    }
  }
  return (
    <Container maxWidth='xl' sx={{ mt: 7, justifyContent: 'center', alignItems: 'center' }}>
      <Box display='flex' justifyContent='center' alignItems='center'>
        <form action={onSubmitForm}>
          <CardContent sx={{ minWidth: 275 }}>
            <center>
              <img src={logo} width='80%' alt='baggian foto' />
            </center>
            <TextField
              fullWidth
              id='id-email'
              label='Email'
              placeholder='xxx@xxx.xx'
              type='email'
              value={getForm.email}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-password'
              label='Password*'
              type='password'
              value={getForm.password}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-repassword'
              label='Re-Password*'
              type='password'
              value={getForm.repassword}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-name'
              label='Name'
              placeholder='input your name'
              type='text'
              value={getForm.name}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'right', alignItems: 'right', mr: 1 }}>
            <Button size='small' variant="contained" type='submit' color='success' onClick={signUp}>
              Register
            </Button>
          </CardActions>
        </form>
      </Box>
    </Container>
  )
}

export default Register
