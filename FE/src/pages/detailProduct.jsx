import { Container, Typography, Grid, Card, CardMedia, Box, Skeleton } from '@mui/material'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setDetailProduct, setLoading } from 'store/product'
import axios from 'axios'


const DetailProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const detailProduct = useSelector(state => state.product.product)
  const detailId = useSelector(state => state.product.detailId)
  const isLogin = useSelector(state => state.authentication.isLogin)
  useEffect(() => {
      if(!isLogin) navigate('/')
      getdetailProduct()
  }, [])
  const getdetailProduct = async () => {
    try {
      dispatch(setLoading(true))
      const token = sessionStorage.getItem("token")
      const { data } = await axios.get(`http://localhost:7009/api/v1/product/${detailId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      dispatch(setDetailProduct(data?.data))
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
            Product Detail
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={8}>
              <Card sx={{ position: 'relative', cursor: 'pointer' }}>
                {isLoading ? (
                  <>
                    <Skeleton variant='rectangular' width={'100%'} height='400px' />
                  </>
                ) : (
                  <CardMedia component='img' height='400' image={detailProduct?.image} sx={{ position: 'relative' }} />
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
                      {detailProduct?.name}
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
                      {detailProduct?.name}
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
                  {detailProduct?.sku}
                  <div style={{fontSize:'25px'}}>
                  {detailProduct?.name}
                  </div>
                  <br></br>
                  <div style={{fontSize:'20px'}}>
                  Description: {detailProduct?.description}
                  <br></br>
                  Price : IDR {detailProduct?.harga?.toLocaleString()}
                  <br></br>
                  Weight : {detailProduct?.weight}
                  <br></br>
                  Height : {detailProduct?.height}
                  <br></br>
                  Length : {detailProduct?.length}
                  <br></br>
                  Width : {detailProduct?.width}
                  <br></br>
                  Category: {detailProduct?.categoryname}
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

export default DetailProduct