import { Routes, Route } from 'react-router-dom'
import Layout from 'layouts'
import { Portal, Login, Register, Detail,Product, ManageAccount, FormAddProduct, FormEditProduct, FormAddAccount, FormEditAccount, DetailProduct } from 'pages'

const Router = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path='/' exact element={<Portal />} />
          <Route path='/detail' exact element={<Detail />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/register' exact element={<Register />} />
          <Route path='/manage-product' exact element={<Product />} />
          <Route path='/detail-product' exact element={<DetailProduct />} />
          <Route path='/manage-account' exact element={<ManageAccount />} />
          <Route path='/add-product' exact element={<FormAddProduct />} />
          <Route path='/edit-product' exact element={<FormEditProduct />} />
          <Route path='/add-customer' exact element={<FormAddAccount />} />
          <Route path='/edit-customer' exact element={<FormEditAccount />} />
        </Routes>
      </Layout>
    </>
  )
}

export default Router
