import { useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardContent, TextField, CardActions, Button, Box, Container, Select } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { handleClick } from 'store/snackbars'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingCategory, setCategory } from 'store/category'
import axios from 'axios'
import Swal from 'sweetalert2'

const initialForm = {
  sku: String,
  name: String,
  harga: Number,
  height: Number,
  weight: Number,
  width: Number,
  length: Number,
  description: String,
  image: Object,

}
const fungsiFormReducer = (state, action) => {
  switch (action.type) {
    case 'sku':
      return { ...state, sku: action.payload }
    case 'name':
      return { ...state, name: action.payload }
    case 'harga':
      return { ...state, harga: action.payload }
    case 'width':
      return { ...state, width: action.payload }
    case 'length':
      return { ...state, length: action.payload }
    case 'height':
      return { ...state, height: action.payload }
    case 'weight':
      return { ...state, weight: action.payload }
    case 'categoryid':
      return { ...state, categoryid: action.payload }
    case 'description':
      return { ...state, description: action.payload }
    case 'image':
      return { ...state, image: action.payload }
    case 'reset':
      return { ...initialForm }
    default:
      return state
  }
}
const FormAddProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getForm, setForm] = useReducer(fungsiFormReducer, initialForm)
  const onChangerValue = event => setForm({ type: event.target.id.replace('id-', ''), payload: event.target.value })
  const onChangeFile = (event) => setForm({ type: event.target.id.replace('id-', ''), payload: event.target.files[0] })
  const handleChange = (event) => {
    setForm({ type: event.target.name, payload: event.target.value })
  } 
  const categories = useSelector(state => state.category.categories)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-confirm-popup',
        cancelButton: 'btn btn-cancel',
        title : 'title-popup'
    },
    buttonsStyling: false
})
useEffect(() => {
  if(!isLogin && !isAdmin) navigate('/')
  getCategories()
}, [])

const getCategories = async () => {
  try {
    dispatch(setLoadingCategory(true))
    const token = sessionStorage.getItem("token")
    const { data } = await axios.get(`http://localhost:7009/api/v1/category`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    dispatch(setCategory(data.data))
    dispatch(setLoadingCategory(false))
  } catch (error) {
    console.log(error, 'ini error')      
  }
}

  const submitProduct = async event => {
    try {
      event.preventDefault()
      const formData = new FormData()
      const { image, name, harga, description, height, weight, length, width, sku, categoryid } = getForm
        formData.append('image', image)
        formData.append('name', name)
        formData.append('harga', harga)
        formData.append('description', description)
        formData.append('height', height)
        formData.append('weight', weight)
        formData.append('length', length)
        formData.append('width', width)
        formData.append('sku', sku)
        formData.append('categoryid', categoryid)
        
        const token = sessionStorage.getItem("token")
        swalWithBootstrapButtons.fire({
          title: `Are you sure want to add this product?`,
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
                  await axios.post(`http://localhost:7009/api/v1/product`, formData, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  }).then(()=>{
                    Swal.fire({
                      icon: 'success',
                      title: 'Sukses',
                      text: `Sukess menambah product`
                    })
                    dispatch(
                      handleClick({
                        message: 'Berhasil Menambah Product',
                        severity: 'info'
                      })
                    )
                    navigate('/manage-product')
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
              id='id-sku'
              label='Sku'
              placeholder='Please input the SKU'
              type='text'
              value={getForm.sku}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
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
              id='id-harga'
              label='Harga'
              type='number'
              value={getForm.harga}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-description'
              label='description'
              type='text'
              value={getForm.description}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-weight'
              label='Weight'
              type='number'
              value={getForm.weight}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-height'
              label='Height'
              type='number'
              value={getForm.height}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-width'
              label='Width'
              type='number'
              value={getForm.width}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <TextField
              fullWidth
              id='id-length'
              label='Length'
              type='number'
              value={getForm.length}
              onChange={onChangerValue}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                id="id-categoryid"
                name="categoryid"
                value={getForm.categoryid}
                label="category"
                onChange={handleChange}
              >
                <MenuItem value={'default'}>Pilih Category</MenuItem>
                {categories?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>{item.category_name}</MenuItem>
                ))}                
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id='id-image'
              type='file'
              onChange={onChangeFile}
              variant='outlined'
              sx={{ my: 1 }}
              required
            />
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

export default FormAddProduct
