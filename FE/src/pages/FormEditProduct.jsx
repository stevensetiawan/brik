import {  useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardContent, CardActions, Button, Box, Container, Skeleton, TextField, Select } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { setDetailProduct, setLoading, update } from 'store/product'
import Swal from 'sweetalert2'
import { handleClick } from 'store/snackbars'
import { useSelector, useDispatch } from 'react-redux'
import { setLoadingCategory, setCategory } from 'store/category'
import axios from 'axios'

const FormEditProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  let imageName = ''
  const onChangerValue = key => event => dispatch(update({[key]: event.target.value }))
  const onChangeFile = key => event => dispatch(update({[key]: event.target.files[0] }))
  const detailId = useSelector(state => state.product.detailId)
  const detailProduct = useSelector(state => state.product.product)
  console.log(detailProduct,'ini detail product')
  const categories = useSelector(state => state.category.categories)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  const isLoading = useSelector(state => state.product.isLoading)
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
    getCategories()
  }, [])
  
  const getProduct = async () => {
    try {
      dispatch(setLoading(true))
      const token = sessionStorage.getItem("token")
      const { data } = await axios.get(`http://localhost:7009/api/v1/product/${detailId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      imageName = data?.data?.image
      const payload = data?.data
      console.log(data, 'ini datanya get product')
      dispatch(setDetailProduct(payload))
      console.log(detailProduct, 'ini detail product di get product')
      dispatch(setLoading(false))
    } catch (error) {
      console.log(error)      
    }
  }

  const getCategories = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const token = sessionStorage.getItem("token")
      const { data } = await axios.get(`http://localhost:7009/api/v1/category`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(data, 'ini datanya')
      dispatch(setCategory(data.data))
      dispatch(setLoadingCategory(false))
    } catch (error) {
      console.log(error)      
    }
  }

  const submitProduct = async event => {
    try {
      event.preventDefault()
      const formData = new FormData()
      if(imageName !== detailProduct.image){
        formData.append('image', detailProduct.image)
      }
        formData.append('name', detailProduct.name)
        formData.append('weight', detailProduct.weight)
        formData.append('height', detailProduct.height)
        formData.append('length', detailProduct.length)
        formData.append('width', detailProduct.width)
        formData.append('harga', detailProduct.harga)
        formData.append('description', detailProduct.description)
        formData.append('categoryid', detailProduct.categoryid)
        const token = sessionStorage.getItem("token")

      swalWithBootstrapButtons.fire({
          title: `Are you sure want to update this product ?`,
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
                      axios.put(`http://localhost:7009/api/v1/product/${detailId}`, formData, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      }).then(()=>{
                        Swal.fire({
                          icon: 'success',
                          title: 'Sukses',
                          text: `Berhasil mengupdate product`
                        })
                        dispatch(
                          handleClick({
                            message: 'Berhasil Mengupdate Product',
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
      console.log(e,"ini erropr")
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
            value={detailProduct?.name}
            onChange={onChangerValue('name')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-harga'
            label='Harga'
            type='number'
            value={detailProduct?.harga}
            onChange={onChangerValue('harga')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-height'
            label='Height'
            type='number'
            value={detailProduct?.height}
            onChange={onChangerValue('height')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-weight'
            label='Weight'
            type='number'
            value={detailProduct?.weight}
            onChange={onChangerValue('weight')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-length'
            label='Length'
            type='number'
            value={detailProduct?.length}
            onChange={onChangerValue('length')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-width'
            label='Width'
            type='number'
            value={detailProduct?.width}
            onChange={onChangerValue('width')}
            sx={{ my: 1 }}
            required
          />
          <TextField
            fullWidth
            id='id-description'
            label='description'
            type='text'
            value={detailProduct?.description}
            onChange={onChangerValue("description")}
            sx={{ my: 1 }}
            required
          />
          <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                id="id-categoryid"
                name="categoryid"
                label="category"
                value={detailProduct?.categoryid}
                onChange={onChangerValue("categoryid")}
              >
                <MenuItem value={'default'}>Pilih Category</MenuItem>                
                {categories?.map((item, index) => (
                  <MenuItem key={index} value={item.id}>{item.category_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          <img src={detailProduct?.image} alt="" border="3" height="100" width="100" />
          <TextField
            fullWidth
            id='id-image'
            type='file'
            onChange={onChangeFile('image')}
            sx={{ my: 1 }}
          />
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

export default FormEditProduct