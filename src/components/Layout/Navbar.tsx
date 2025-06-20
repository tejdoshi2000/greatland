import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Contact', path: '/contact' },
    { label: 'Submit Application', path: '/submit-application', icon: <DescriptionIcon /> },
  ];

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ 
        width: { xs: '100vw', sm: 280 },
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: theme.palette.primary.main,
        color: 'white'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
          Greatland Properties
        </Typography>
      </Box>
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              sx={{ 
                py: 2,
                px: 3,
                '&:hover': { 
                  backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                },
                '&:active': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)'
                }
              }}
            >
              {item.icon && <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>}
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 500
                }}
              />
            </ListItemButton>
            {index < menuItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={1} 
      sx={{ 
        bgcolor: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1, sm: 1.5 }
      }}>
        <Typography
          variant={isSmallMobile ? "h6" : "h5"}
          component="div"
          sx={{
            flexGrow: 0,
            fontWeight: 700,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate('/')}
        >
          Greatland Properties
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{
                p: { xs: 1, sm: 1.5 },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  width: { xs: '100vw', sm: 280 }
                }
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            gap: { md: 1, lg: 2 },
            alignItems: 'center'
          }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: { md: '0.9rem', lg: '1rem' },
                  px: { md: 1.5, lg: 2 },
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  ...(item.label === 'Submit Application' && {
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: 2,
                    px: { md: 2, lg: 2.5 },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      borderColor: theme.palette.primary.main,
                    }
                  })
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 