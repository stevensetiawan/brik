import { useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardContent, TextField, CardActions, Button, Box, Container } from '@mui/material'
import { handleClick } from 'store/snackbars'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'

const initialForm = {
  name: String,
  email: String,
  phone: String,
  password: String,
  address: String
}
const fungsiFormReducer = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload }
    case 'email':
      return { ...state, email: action.payload }
    case 'phone':
      return { ...state, phone: action.payload }
    case 'password':
      return { ...state, password: action.payload }
    case 'address':
      return { ...state, address: action.payload }
    case 'reset':
      return { ...initialForm }
    default:
      return state
  }
}
const FormAddAccount = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getForm, setForm] = useReducer(fungsiFormReducer, initialForm)
  const onChangerValue = event => setForm({ type: event.target.id.replace('id-', ''), payload: event.target.value })
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-confirm-popup',
        cancelButton: 'btn btn-cancel',
        title : 'title-popup'
    },
    buttonsStyling: false
  })
  const isLogin = useSelector(state => state.authentication.isLogin)

  useEffect(() => {
    if(!isLogin) navigate('/')
  }, [])

  
  const submitAccount = async event => {
    try {
      event.preventDefault()
        const token = sessionStorage.getItem("token")
        swalWithBootstrapButtons.fire({
          title: `Are you sure want to add this package?`,
          text: "This data will be add",
          icon: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
              Swal.fire({
                title: 'Processing the data!',
                allowOutsideClick: false,
                timerProgressBar: true,
                didOpen: async () => {
                  Swal.showLoading()
                  await axios.post(`http://localhost:3002/api/v1/customer/signup`, getForm, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  }).then(()=>{
                    Swal.fire({
                      icon: 'success',
                      title: 'Sukses',
                      text: `Sukess menghapus product`
                    })
                    dispatch(
                      handleClick({
                        message: 'Berhasil Menambah Product',
                        severity: 'info'
                      })
                    )
                    navigate('/manage-account')
                  })                    
                }
              })
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                  'Cancelled!'
              )
            }
        })
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
        <form>
          <CardContent sx={{ minWidth: 275 }}>
            <TextField
              fullWidth
              id='id-name'
              label='Name'
              placeholder='Please input the name'
              type='text'
              value={getForm.name}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-email'
              label='Email'
              type='email'
              value={getForm.email}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-phone'
              label='phone'
              type='text'
              value={getForm.phone}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-password'
              label='password'
              type='text'
              value={getForm.password}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'right', alignItems: 'right', mr: 1 }}>
            <Button size='small' variant="contained" type='submit' color='success' onClick={submitAccount}>
              Submit
            </Button>
          </CardActions>
        </form>
      </Box>
    </Container>
  )
}

export default FormAddAccount
