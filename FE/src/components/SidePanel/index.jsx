import Drawer from '@mui/material/Drawer'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setSidePanel } from 'store/sidePanel'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import InventoryIcon from '@mui/icons-material/Inventory'
import { handleClick } from 'store/snackbars'
import { logout } from 'store/authentication'

const Right = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOpen = useSelector(state => state.sidePanel.isOpen)
  const isLogin = useSelector(state => state.authentication.isLogin)
  const isAdmin = useSelector(state => state.authentication.isAdmin)
  const anchor = 'right'
  const toggleDrawer = open => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    dispatch(setSidePanel(open))
  }
  const btnLogout = async () => {
    try{
      dispatch(
        handleClick({
          message: 'Berhasil logout',
          severity: 'success'
        })
      )
      sessionStorage.clear()
      dispatch(logout())
      navigate('/')
    } catch(errors){
      dispatch(
        handleClick({
          message: errors.message,
          severity: 'error'
        })
      )
    }
  }

  return (
    <>
      <Drawer anchor={anchor} open={isOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role='presentation'
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {isLogin == false && (
              <>
                <ListItem component={Link} to='/login' disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary='Login' />
                  </ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/register' disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LockOpenIcon />
                    </ListItemIcon>
                    <ListItemText primary='Register' />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {isLogin != false &&  isAdmin && (
              <>
              <ListItem component={Link} to='/manage-product' disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary='Manage Product'/>
                </ListItemButton>
              </ListItem>
              </>
            )}
            {isLogin != false && (
              <ListItem onClick={btnLogout} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary='logout' />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Right
