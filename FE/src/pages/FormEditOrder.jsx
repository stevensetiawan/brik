import {  useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardContent, CardActions, Button, Box, Container, Skeleton, TextField } from '@mui/material'
import { setDetailOrder, setLoading, update } from 'store/order'
import Swal from 'sweetalert2'
import { handleClick } from 'store/snackbars'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const FormEditOrder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onChangerValue = (key) => event => dispatch(update({[key]: event.target.value }))
  const detailId = useSelector(state => state.order.detailId)
  const detailOrder = useSelector(state => state.order.detailOrder)
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
    getOrder()
  }, [])
  const getOrder = async () => {
    try {
      dispatch(setLoading(true))
      const token = sessionStorage.getItem("token")
      const { data } = await axios.get(`http://localhost:3002/api/v1/order-detail/${detailId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if(data && data.length > 0){
        let newForm = {
          id: data[0].id,
          orderId: data[0].orderId._id,
          packageId: data[0].packageId._id,
          totalPrice: data[0].orderId.totalPrice,
          qty: data[0].qty
        }
        dispatch(setDetailOrder(newForm))
        dispatch(setLoading(false))  
      }
    } catch (error) {
      console.log(error)      
    }
  }
  const submitOrder = async event => {
    try {
      event.preventDefault()
      const token = sessionStorage.getItem("token")

      swalWithBootstrapButtons.fire({
          title: `Are you sure want to submit this order?`,
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
                      axios.put(`http://localhost:3002/api/v1/order/${detailId}`, detailOrder, {
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
                            message: 'Berhasil Menambah Order',
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
          </>
        ) : (
        <>
      <CardContent sx={{ minWidth: 275 }}>
          <TextField
            fullWidth
            id='id-total_price'
            label='Total Price'
            type='number'
            value={detailOrder.totalPrice}
            onChange={onChangerValue('totalPrice')}
            sx={{ my: 1 }}
            required
          />
           <TextField
            fullWidth
            id='id-qty'
            label='Qty'
            type='number'
            value={detailOrder.qty}
            onChange={onChangerValue('qty')}
            sx={{ my: 1 }}
            required
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'right', alignItems: 'right', mr: 1 }}>
          <Button size='small' variant="contained" type='submit' color='success' onClick={submitOrder}>
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

export default FormEditOrder