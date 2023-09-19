import {  useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardContent, CardActions, Button, Box, Container, Skeleton, TextField } from '@mui/material'
import { setDetailCustomer, setLoading, update } from 'store/account'
import Swal from 'sweetalert2'
import { handleClick } from 'store/snackbars'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { SelectChangeEvent } from '@mui/material/Select';


const FormEditAccount = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onChangerValue = (key) => event => dispatch(update({[key]: event.target.value }))
  const detailId = useSelector(state => state.account.detailId)
  const detailCustomer = useSelector(state => state.account.detailCustomer)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  const isLoading = useSelector(state => state.account.isLoading)
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-confirm-popup',
        cancelButton: 'btn btn-cancel',
        title : 'title-popup'
    },
    buttonsStyling: false
})
  const handleChange = key => (event: SelectChangeEvent) => {
    dispatch(update({[key]: event.target.value }))
  }  
  useEffect(() => {
    if (!isLogin && !isAdmin) navigate('/')
    getCustomer()
  }, [])
  const getCustomer = async () => {
    try {
      dispatch(setLoading(true))
      const token = sessionStorage.getItem("token")
      const { data } = await axios.get(`http://localhost:3002/api/v1/customer/${detailId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      dispatch(setDetailCustomer(data))
      dispatch(setLoading(false))
    } catch (error) {
      console.log(error)      
    }
  }
  const submitProduct = async event => {
    try {
      event.preventDefault()      
      const token = sessionStorage.getItem("token")
      swalWithBootstrapButtons.fire({
          title: `Are you sure want to submit this ship code?`,
          text: "This data will be saved",
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
                      axios.put(`http://localhost:3002/api/v1/customer/${detailId}`, detailCustomer, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      }).then(()=>{
                        Swal.fire({
                          icon: 'success',
                          title: 'Sukses',
                          text: `Please input correctly`
                        })
                        dispatch(
                          handleClick({
                            message: 'Berhasil Mengupdate Customer',
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
        {isLoading ?(
          <>
          <Skeleton/>
          <Skeleton/>
          <Skeleton/>
          <Skeleton/>
          </>
        ) : (
        <>
      <CardContent sx={{ minWidth: 275 }}>
          <TextField
            fullWidth
            id='id-name'
            label='Name'
            placeholder='Please input the name'
            type='text'
            value={detailCustomer.name}
            onChange={onChangerValue('name')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-email'
            label='Email'
            type='email'
            value={detailCustomer.email}
            onChange={onChangerValue('email')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-phone'
            label='phone'
            type='text'
            value={detailCustomer.phone}
            onChange={onChangerValue("phone")}
            sx={{ my: 1 }}
            required
          />
           <TextField
            fullWidth
            id='id-password'
            label='password'
            type='text'
            value={detailCustomer.password}
            onChange={onChangerValue("password")}
            sx={{ my: 1 }}
            required
          />
           <TextField
            fullWidth
            id='id-address'
            label='address'
            type='text'
            value={detailCustomer.address}
            onChange={onChangerValue("address")}
            sx={{ my: 1 }}
            required
          />
          <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                id="id-role"
                name="role"
                value={detailCustomer.role}
                label="role"
                onChange={handleChange('role')}
              >
                <MenuItem value={'admin'}>Admin</MenuItem>
                <MenuItem value={'user'}>User</MenuItem>
              </Select>
            </FormControl>
        </CardContent>
        <CardActions sx={{ justifyContent: 'right', alignItems: 'right', mr: 1 }}>
          <Button size='small' variant="contained" type='submit' color='success' onClick={submitProduct}>
            Submit
          </Button>
        </CardActions>
        </>
      ) }
        </form>
      </Box>
    </Container>
  )
}

export default FormEditAccount