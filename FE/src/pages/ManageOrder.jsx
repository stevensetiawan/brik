import { Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'
import { handleClick } from 'store/snackbars'
import { getOrders, setDetailId, deleteOrder} from 'store/order'


const ManageOrder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const orders = useSelector(state => state.order.orders)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-confirm-popup',
        cancelButton: 'btn btn-cancel',
        title : 'title-popup'
    },
    buttonsStyling: false
})
  useEffect(() => {
    isLogin && isAdmin ? dispatch(getOrders()) : navigate('/')
  }, [])

  const deleteOrderAction = (id) => async (event) => {
    event.preventDefault()
    try {
      const token = sessionStorage.getItem("token")
      swalWithBootstrapButtons.fire({
        title: `Are you sure want to delete this order?`,
        text: "This data will be deleted",
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
                  await axios.delete(`http://localhost:3002/api/v1/order/${id}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  })
                  .then(()=>{
                    Swal.fire({
                      icon: 'success',
                      title: 'Sukses',
                      text: `Sukess menghapus order`
                    })
                    dispatch(
                      handleClick({
                        message: `Berhasil menghapus order`,
                        severity: 'success'
                      })
                    )
                    dispatch(deleteOrder(id))
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
    } catch (error) {
      console.log(error)
      dispatch(
        handleClick({
          message: error.message,
          severity: 'error'
        })
      )
    }
  }

  const updateOrder = (id) => async (event) => {
    event.preventDefault()
    dispatch(setDetailId(id))
    navigate('/edit-order')
  }
  
  const addOrder = event => {
    event.preventDefault()
    navigate('/add-order')
  }
  return (
    <>
    <h1>Manage Order</h1>
    <Button size='small' variant="contained" type='submit' color='primary' onClick={addOrder}>
        Add Order
    </Button>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell align="right">Total Price</TableCell>
            <TableCell align="right">Order Time</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer'}}
            >

              <TableCell component="th" scope="row">
                {row.orderNumber}
              </TableCell>
              <TableCell align="right">{row.totalPrice}</TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
              <TableCell align="right">
                <Button size='small' variant="contained" type='submit' color='success' onClick={updateOrder(row.id)}>
                  <EditIcon/> Edit
                </Button>
                <Button size='small' variant="contained" type='submit' color='error' sx={{marginLeft : '3%'}} onClick={deleteOrderAction(row.id)}>
                  <DeleteIcon/> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default ManageOrder