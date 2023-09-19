import { Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect,useState } from 'react'
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios'
import Swal from 'sweetalert2'
import { handleClick } from 'store/snackbars'
import { getProducts, setDetailId, deleteProduct } from 'store/product'
import useTable from '../hooks/useTable'


const Product = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const products = useSelector(state => state.product.products)
  const {
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-confirm-popup',
        cancelButton: 'btn btn-cancel',
        title : 'title-popup'
    },
    buttonsStyling: false
})

const deleteProduk = (id) => (event) => {
  event.preventDefault()
  try {
    const token = sessionStorage.getItem("token")
    swalWithBootstrapButtons.fire({
      title: `Are you sure want to delete this product?`,
      text: "This product will be deleted",
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
                await axios.delete(`http://localhost:7009/api/v1/product/${id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                })
                .then(()=>{
                  dispatch(deleteProduct(id))
                  Swal.fire({
                    icon: 'success',
                    title: 'Sukses',
                    text: `Sukes menghapus product`
                  })
                  dispatch(
                    handleClick({
                      message: `Berhasil menghapus product`,
                      severity: 'success'
                    })
                  )
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
    dispatch(
      handleClick({
        message: error.message,
        severity: 'error'
      })
    )
  }
}
  
  

  const updateProduct = (id) => async (event) => {
    event.preventDefault()
    dispatch(setDetailId(id))
    navigate('/edit-product')
  }
  
  const addProduct = event => {
    event.preventDefault()
    navigate('/add-product')
  }

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    handleOpen()
    isLogin && isAdmin ? dispatch(getProducts(rowsPerPage, page)) : navigate('/')
    handleClose()
  }, [rowsPerPage, page])
  const detailProduct = (id) => event => {
    event.preventDefault()
    dispatch(setDetailId(id))
    navigate('/detail-product')
  }
  return (
    <>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
    <CircularProgress />
    </Backdrop>
    <h1>Product Management</h1>
    <Button size='small' variant="contained" type='submit' color='primary' onClick={addProduct}>
        Add Product
    </Button>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Description</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.data?.map((row) => (
            <TableRow
              key={row.id}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.harga}</TableCell>
              <TableCell align="right"><img src={row.image} alt="" border="3" height="100" width="100" /></TableCell>
              <TableCell align="right">
                <Button size='small' variant="contained" type='submit' color='success' onClick={updateProduct(row.id)}>
                  <EditIcon/> Edit
                </Button>
                <Button size='small' variant="contained" type='submit' color='error' sx={{marginLeft : '3%'}} onClick={deleteProduk(row.id)}>
                  <DeleteIcon/> Delete
                </Button>
                <Button size='small' variant="contained" type='submit' color='info' sx={{marginLeft : '3%'}} onClick={detailProduct(row.id)}>
                  <InfoIcon/> Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      count={products?.totalFiltered}
      page={page - 1 >= 0 ? page - 1 : 0}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5,10,25]}
      onPageChange={(e, currPage) => onChangePage(e, currPage + 1)}
      onRowsPerPageChange={(e) => onChangeRowsPerPage(e)}
    />   
  </>
  )
}

export default Product