import { Container, Typography, Grid, Card, CardMedia, Box, Skeleton } from '@mui/material'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setDetailOrder, setLoading } from 'store/order'
import axios from 'axios'


const DetailOrder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const detailOrder = useSelector(state => state.order.detailOrder)
  const detailId = useSelector(state => state.order.detailId)
  const isLogin = useSelector(state => state.authentication.isLogin)
  useEffect(() => {
      if(!isLogin) navigate('/')
      getDetailOrder()
  }, [])
  const getDetailOrder = async () => {
    try {
      dispatch(setLoading(true))
      const token = sessionStorage.getItem("token")
      const { data } = await axios.get(`http://localhost:3002/api/v1/order-detail/${detailId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      dispatch(setDetailOrder(data[0]))
      dispatch(setLoading(false))
    } catch (error) {
      console.log(error)      
    }
  }
  const isLoading = useSelector(state => state.order.isLoading)

  
  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: '95%' }}>
        <Grid container item sx={{ mt: 6 }}>
          <Typography
            variant='h4'
            sx={{
              mb: 1,
              fontWeight: 700
            }}
          >
            Order Detail
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={8}>
              <Card sx={{ position: 'relative', cursor: 'pointer' }}>
                {isLoading ? (
                  <>
                    <Skeleton variant='rectangular' width={'100%'} height='400px' />
                  </>
                ) : (
                  <CardMedia component='img' height='400' image={detailOrder.packageId.image} sx={{ position: 'relative' }} />
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
                      {detailOrder.packageId.name}
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
                      {detailOrder.packageId.name}
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
                  {detailOrder.packageId.name}
                  <div style={{fontSize:'25px'}}>
                  {detailOrder.packageId.description}
                  </div>
                  <div style={{fontSize:'20px'}}>
                  Price : IDR {detailOrder.packageId.price.toLocaleString()}
                  </div>
                  <div style={{fontSize:'20px'}}>
                  Qty : {detailOrder.qty}
                  </div>
                  <div style={{fontSize:'20px'}}>
                  Total Price : IDR {detailOrder.orderId.totalPrice.toLocaleString()}
                  </div>
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

export default  DetailOrder