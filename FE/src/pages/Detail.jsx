import { Container, Typography, Grid, Card, CardMedia, Box, Skeleton, Button } from '@mui/material'
import { selectCheckout } from 'store/checkout'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Detail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const pickPackage = useSelector(state => state.travel_package.pickPackage)
  const isLoading = useSelector(state => state.travel_package.isLoading)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)

  useEffect(() => {
    Object.keys(pickPackage).length === 0 && navigate('/')
  }, [])

  const checkout = item => event => {
    event.preventDefault()
    dispatch(selectCheckout(item))
    navigate('/checkout')
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
          {pickPackage.name}
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={15}>
              <Card sx={{ position: 'relative' }}>
                {isLoading ? (
                  <>
                    <Skeleton variant='rectangular' width={'100%'} height='400px' />
                  </>
                ) : (
                  <CardMedia component='img' height='400' image={pickPackage.image} sx={{ position: 'relative' }} />
                )}
              </Card>
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
          {pickPackage.description}
        </Typography>
        {pickPackage ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                maxWidth: '12%'
              }}
            >
              <Typography variant='h5'>{pickPackage.price}</Typography>
              {isLogin && !isAdmin && (<Button size='small' variant="contained" color='success' onClick={checkout(pickPackage)}>
                Order
              </Button>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                maxWidth: '12%'
              }}
            >
              <Skeleton />
              <Skeleton />
            </Box>
          </>
        )}
      </Container>
    </>
  )
}

export default Detail