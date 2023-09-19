import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { handleClose } from 'store/snackbars'
import { useSelector, useDispatch } from 'react-redux'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})
const Snackbars = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector(state => state.snackbars.isOpen)
  const autoHideDuration = useSelector(state => state.snackbars.autoHideDuration)
  const anchorOrigin = useSelector(state => state.snackbars.anchorOrigin)
  const message = useSelector(state => state.snackbars.message)
  const severity = useSelector(state => state.snackbars.severity)
  const onClose = event => {
    event?.preventDefault()
    dispatch(handleClose())
  }
  return (
    <Snackbar open={isOpen} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={anchorOrigin}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Snackbars
