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

import { getOrders, setDetailId} from 'store/order'


const Order = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const orders = useSelector(state => state.order.orders)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)

  useEffect(() => {
    isLogin && !isAdmin? dispatch(getOrders()) : navigate('/')
  }, [])
  const detailOrder = (id) => event => {
    event.preventDefault()
    dispatch(setDetailId(id))
    navigate('/detail-order')
  }
  
  return (
    <>
    <h1>Detail Order</h1>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell align="right">Total Price</TableCell>
            <TableCell align="right">Order Time&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <TableRow
              onClick={detailOrder(row.id)}
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer'}}
            >

              <TableCell component="th" scope="row">
                {row.orderNumber}
              </TableCell>
              <TableCell align="right">{row.totalPrice}</TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default Order