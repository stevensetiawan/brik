import { configureStore } from '@reduxjs/toolkit'
import sidePanel from './sidePanel'
import authentication from './authentication'
import travel_package from './travel_package'
import checkout from './checkout'
import order from './order'
import product from './product'
import account from './account'
import category from './category'
import snackbars from './snackbars'
import modal from './modal'
export const store = configureStore({
  reducer: {
    sidePanel,
    authentication,
    travel_package,
    checkout,
    snackbars,
    modal,
    order,
    product,
    account,
    category
  }
})

