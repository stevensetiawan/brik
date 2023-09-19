import { Container, Typography, Grid, Card, Box, CardMedia, CardContent, Skeleton, Button } from '@mui/material'
import { getProducts, setDetailId } from 'store/product'
import { selectCheckout } from 'store/checkout'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Portal = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const packages = useSelector(state => state.travel_package.packages)
  const products = useSelector(state => state.product.products)
  const isLoading = useSelector(state => state.travel_package.isLoading)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  console.log(products?.data?.[0]?.id, 'ini products')

  const detailProduct = id => event => {
    event.preventDefault()
    console.log("masuk", id)
    dispatch(setDetailId(id))
    navigate('/detail-product')
  }
  
  useEffect(() => {
    dispatch(getProducts())
  }, [])

  const checkout = item => event => {
    event.preventDefault()
    dispatch(selectCheckout(item))
    navigate('checkout')
  }
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
            Hot Offer
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={8}>
              <Card sx={{ position: 'relative', cursor: 'pointer' }} onClick={''}>
                {isLoading ? (
                  <>
                    <Skeleton variant='rectangular' width={'100%'} height='400px' />
                  </>
                ) : (
                  <CardMedia component='img' height='400' image={products?.data?.[0]?.image} sx={{ position: 'relative' }}/>
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
                    onClick={detailProduct(products?.data?.[0]?.id)}
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        color: 'brown',
                        backgroundColor: 'yellow',
                        fontWeight: 700,
                        WebkitLineClamp: 1,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {products?.data?.[0]?.description}
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        color: 'dark brown',
                        fontWeight: 700,
                        WebkitLineClamp: 1,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {products?.data?.[0]?.categoryname}
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
                  <u>{products?.data?.[0]?.name}</u>
                  <div style={{fontSize:'20px'}}>
                  IDR {products?.data?.[0]?.harga?.toLocaleString()}
                  <br></br>
                  {products?.data?.[0]?.weight} gr
                  </div>
                </Typography>              
              </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {/* bagian  last news*/}
      <Container maxWidth={false} sx={{ maxWidth: '95%' }}>
        <Typography
          variant='h4'
          sx={{
            my: 2,
            fontWeight: 700
          }}
        >
          Highlight
        </Typography>
        <Grid Grid container spacing={2}>
          {(isLoading ? Array.from(new Array(10)) : products)?.data?.map((item, index) => (
            <Grid key={item ? `grid-${item.name}-${index}` : index} item xs={3}>
              <Card
                key={item ? `detail-${item.name}-${index}` : index}
                elevation={0}
                sx={{ cursor: 'pointer' }}
              >
                {item ? (
                  <CardMedia component='img' height='140' image={item.image} onClick={detailProduct(item.id)} alt='' />
                ) : (
                  <Skeleton variant='rectangular' height='140' />
                )}

                <CardContent>
                  {item ? (
                    <>
                      <Typography gutterBottom variant='h5' component='div'>
                        {item.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap'
                        }}
                      >
                        {/* <Typography variant='body1'>{item.published_at}</Typography> */}
                        <Typography variant='body1'>IDR {item.harga.toLocaleString()}</Typography>
                        {isLogin && !isAdmin && (<Button size='small' variant="contained" color='success' onClick={checkout(item)}>
                          Order
                        </Button>
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      <Skeleton width='100%' />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap'
                        }}
                      >
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export default Portal
