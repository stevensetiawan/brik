import { Box, Typography } from '@mui/material'
const Footer = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#2C5F2D', 
      }}>
      <Typography sx={{ px: 2, color: '#F9D030' }} variant='h6' component='h2'>
        Copyright 2022 Insignia Travel by Steven Setiawan
      </Typography>
    </Box>
  )
}

export default Footer
