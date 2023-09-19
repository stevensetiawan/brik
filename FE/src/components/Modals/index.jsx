import { Modal, Box, Typography, CardContent, TextField, CardActions, Button } from '@mui/material'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { handleModalClose } from 'store/modal'
import { setKeyword, getNewsMediastack } from 'store/travel_package'
const Modals = () => {
  const dispatch = useDispatch()
  const open = useSelector(state => state.modal.isModalOpen)
  const style = useSelector(state => state.modal.style)
  const isLoading = useSelector(state => state.travel_package.isLoading)
  const [keyword, changeKeyword] = useState('')
  const onCloseModal = event => {
    event?.preventDefault()
    dispatch(handleModalClose())
  }
  const onChangerValue = event => {
    event?.preventDefault()
    changeKeyword(event.target.value)
  }
  const onSubmitForm = event => {
    event?.preventDefault()
    dispatch(setKeyword(keyword))
    dispatch(getNewsMediastack())
  }
  return (
    <>
      <Modal
        open={open}
        onClose={onCloseModal}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style }}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Pencarian Berita
          </Typography>
          <form onSubmit={onSubmitForm}>
            <CardContent>
              <TextField
                fullWidth
                type='text'
                value={keyword}
                onChange={onChangerValue}
                variant='outlined'
                sx={{ my: 1 }}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: 'right', alignItems: 'right', mr: 1 }}>
              <Button size='large' variant='outlined' type='submit' color='success' disabled={isLoading}>
                Cari
              </Button>
            </CardActions>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default Modals
