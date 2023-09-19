import { Container, Typography, Grid, Card, CardMedia, Box, Skeleton, Button } from '@mui/material'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPayment } from 'store/checkout'
import { handleClick } from 'store/snackbars'
import axios from 'axios'
import Swal from 'sweetalert2'

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onChangerValue = event => dispatch(setPayment({payload: event.target.value}))
  const isOpen = useSelector(state => state.snackbars.isOpen)
  const pickCheckout = useSelector(state => state.checkout.pickCheckout)
  const pickQty = useSelector(state => state.checkout.detailPayment.qty)
  const detailPayment = useSelector(state => state.checkout.detailPayment)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)

  useEffect(() => {
      if(!isLogin && isAdmin) navigate('/')
  }, [])
  const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
      confirmButton: 'btn btn-confirm-popup',
      cancelButton: 'btn btn-cancel',
      title : 'title-popup'
  },
  buttonsStyling: false
})
  const isLoading = useSelector(state => state.checkout.isLoading)
  const pay = async event => {
    event.preventDefault()
    try{
      swalWithBootstrapButtons.fire({
        title: `Are you sure want to pay this package?`,
        text: "Package",
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
                const payload = {
                  qty: detailPayment.qty,
                  total_price: detailPayment.qty * pickCheckout.price,
                  package_id: pickCheckout.id
                }
                const token = sessionStorage.getItem("token")
                await axios.post(`http://localhost:3002/api/v1/order`, payload, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }).then(()=>{
                  Swal.fire({
                    icon: 'success',
                    title: 'Sukses',
                    text: `Sukess Checkout`
                  })
                dispatch(
                  handleClick({
                    message: 'Order sukses',
                    severity: 'success'
                  })
                )
                navigate('/order')
                }).catch((err) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Gagal Checkout: ${err.message}`
                  })
                  dispatch(
                    handleClick({
                      message: 'Order gagal',
                      severity: 'error'
                    })
                  )
                  navigate('/detail-order')
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
    }catch(err){
      dispatch(
        handleClick({
          message: err.message,
          severity: 'error'
        })
      )
      navigate('/')
    }
  }
  return (
    <>
      {/* news hot topics */}
      <Container maxWidth={false} sx={{ maxWidth: '95%' }}>
        <Grid container item sx={{ mt: 6 }}>
          <Typography
            variant='h4'
            sx={{
              mb: 1,
              fontWeight: 700
            }}
          >
            Payment Detail
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={8}>
              <Card sx={{ position: 'relative', cursor: 'pointer' }}>
                {isLoading ? (
                  <>
                    <Skeleton variant='rectangular' width={'100%'} height='400px' />
                  </>
                ) : (
                  <CardMedia component='img' height='400' image={pickCheckout.image} sx={{ position: 'relative' }} />
                )}
                {isLoading ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      alignItems: 'flex-start',
                      alignContent: 'flex-end',
                      width: '100%',
                      height: '100%',
                      bottom: 0,
                      mb: 2,
                      ml: 2
                    }}
                  >
                    <Skeleton width='60%' />
                    <Skeleton />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: 'absolute',
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      alignItems: 'flex-start',
                      alignContent: 'flex-end',
                      width: '100%',
                      height: '100%',
                      bottom: 0,
                      mb: 2,
                      ml: 2
                    }}
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        color: 'white',
                        WebkitLineClamp: 1,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {pickCheckout.name}
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        color: 'white',
                        WebkitLineClamp: 1,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {pickCheckout.name}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
            <Grid container item xs={3} rowSpacing={0}>
              {isLoading ? (
                <>
                  <Skeleton width='100%' />
                  <Skeleton width='100%' />
                  <Skeleton />
                </>
              ) : (
                <>
                <Typography
                  variant='h4'
                >
                  {pickCheckout.description}
                  <div style={{fontSize:'20px'}}>
                  {pickCheckout.name}
                  </div>
                  <div style={{fontSize:'20px'}}>
                  {pickCheckout.price}
                  </div>
                  <div>
                    <input type="number" id="quantity" name="quantity" min='1' value={pickQty} onChange={onChangerValue} required />
                  </div>
                  <Button size='small' variant="contained" type='submit' color='primary' disabled={isOpen} onClick={pay}>
                    Pay
                  </Button>
                </Typography>              
              </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Checkout