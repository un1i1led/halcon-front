// src/components/Layout/DashboardLayout.tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const closedDrawerWidth = 65; 

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: closedDrawerWidth,
    width: `calc(100% - ${closedDrawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
    },
  }),
  ...(!open && {
    width: closedDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    '& .MuiDrawer-paper': {
      width: closedDrawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
    },
  }),
}));

interface NavigationItem {
  path: string;
  title: string;
  icon: React.ReactNode;
}

const useNavigationItems = (userRole?: string) => {
  return React.useMemo(() => {
    const items: NavigationItem[] = [
      {
        path: '/dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
      }
    ];

    if (userRole === 'admin') {
      items.push(
        {
          path: '/users',
          title: 'Usuarios',
          icon: <GroupIcon />,
        },
        {
          path: '/customers',
          title: 'Clientes',
          icon: <ShoppingBagIcon />,
        }
      );
    }

    return items;
  }, [userRole]);
};

const DrawerContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const NavigationList: React.FC<{
  items: NavigationItem[];
  open: boolean;
  onNavigate: (path: string) => void;
  currentPath: string;
}> = React.memo(({ items, open, onNavigate, currentPath }) => (
  <List>
    {items.map((item) => (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          selected={currentPath === item.path}
          onClick={() => onNavigate(item.path)}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.title} 
            sx={{ 
              opacity: open ? 1 : 0,
              transition: theme => theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          />
        </ListItemButton>
      </ListItem>
    ))}
  </List>
));

const LogoutButton: React.FC<{
  open: boolean;
  onLogout: () => void;
}> = React.memo(({ open, onLogout }) => (
  <List sx={{ mt: 'auto' }}>
    <Divider />
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        onClick={onLogout}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Logout />
        </ListItemIcon>
        <ListItemText 
          primary='Cerrar Sesión' 
          sx={{ 
            opacity: open ? 1 : 0,
            transition: theme => theme.transitions.create('opacity', {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        />
      </ListItemButton>
    </ListItem>
  </List>
));

LogoutButton.displayName = 'LogoutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = React.useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }, []);
  
  const navigationItems = useNavigationItems(user?.role);

  const handleDrawerOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleDrawerClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleNavigation = React.useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Halcon Inc.
          </Typography>
        </Toolbar>
      </AppBar>
      <StyledDrawer 
        variant='permanent' 
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: theme => theme.palette.primary.main,
            color: 'white',
            '& .MuiListItemIcon-root': {
              color: 'white'
            }
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            {open && (
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon sx={{ color: 'white' }} />
              </IconButton>
            )}
          </DrawerHeader>
          <Divider />
          <NavigationList
            items={navigationItems}
            open={open}
            onNavigate={handleNavigation}
            currentPath={location.pathname}
          />
          <LogoutButton open={open} onLogout={handleLogout} />
        </DrawerContent>
      </StyledDrawer>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : closedDrawerWidth}px)` },
          transition: theme => theme.transitions.create('width', {
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}