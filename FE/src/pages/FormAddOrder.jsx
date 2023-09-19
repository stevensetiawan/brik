import { useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardContent, TextField, CardActions, Button, Box, Container } from '@mui/material'
import { handleClick } from 'store/snackbars'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { setProduct, setLoading, setCustomer } from 'store/order'

const initialForm = {
  customerId: 'default',
  totalPrice: Number,
  packageId: 'default',
  qty: 1
}
const fungsiFormReducer = (state, action) => {
  switch (action.type) {
    case 'customerId':
      return { ...state, customerId: action.payload }
    case 'totalPrice':
      return { ...state, totalPrice: action.payload }
    case 'packageId':
      return { ...state, packageId: action.payload }
    case 'qty':
      return { ...state, qty: action.payload }
    case 'reset':
      return { ...initialForm }
    default:
      return state
  }
}
const FormAddOrder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getForm, setForm] = useReducer(fungsiFormReducer, initialForm)
  const onChangerValue = event => setForm({ type: event.target.id.replace('id-', ''), payload: event.target.value })
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  const products = useSelector(state => state.order.products)
  const customers = useSelector(state => state.order.customers)
  const handleChange = (event) => {
    
    setForm({ type: event.target.name, payload: event.target.value })
  }  

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
      confirmButton: 'btn btn-confirm-popup',
      cancelButton: 'btn btn-cancel',
      title : 'title-popup'
  },
  buttonsStyling: false
})
useEffect(() => {
  if (!isLogin && !isAdmin) navigate('/')
  getProduct()
  getCustomer()
}, [])
const getProduct = async () => {
  try {
    dispatch(setLoading(true))
    const { data } = await axios.get(`http://localhost:3002/api/v1/package`)
    dispatch(setProduct(data))
    dispatch(setLoading(false))
  } catch (error) {
    console.log(error)      
  }
}
const getCustomer = async () => {
  try {
    dispatch(setLoading(true))
    const token = sessionStorage.getItem("token")
    const { data } = await axios.get(`http://localhost:3002/api/v1/customer`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    dispatch(setCustomer(data))
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
                  await axios.post(`http://localhost:3002/api/v1/order`, getForm, {
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
                    navigate('/manage-order')
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
              id='id-qty'
              label='Qty'
              placeholder='Please input the qty'
              type='number'
              value={getForm.qty}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-totalPrice'
              label='Price'
              type='number'
              value={getForm.totalPrice}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Package</InputLabel>
              <Select
                id="id-packageId"
                name="packageId"
                value={getForm.packageId}
                label="package"
                onChange={handleChange}
              >
                <MenuItem value={'default'}>Pilih Package</MenuItem>
                {products.map((item, index) => (
                  <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                ))}                
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Customer</InputLabel>
              <Select
                id="id-customerId"
                name="customerId"
                value={getForm.customerId}
                label="customer"
                onChange={handleChange}
              >
                <MenuItem value={'default'}>Pilih Customer</MenuItem>
                {customers.map((item, index) => (
                  <MenuItem key={index} value={item.id}>{item.email} - {item.name}</MenuItem>
                ))}                
              </Select>
            </FormControl>
          </CardContent>
          <CardActions sx={{ justifyContent: 'right', alignItems: 'right', mr: 1 }}>
            <Button size='small' variant="contained" type='submit' color='success' onClick={submitProduct}>
              Submit
            </Button>
          </CardActions>
        </form>
      </Box>
    </Container>
  )
}

export default FormAddOrder
