import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';

const Navbar = () => {
  const theme = useTheme();

  return (
    <AppBar position="sticky" color="default">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box display="flex" alignItems="center" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <HomeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: theme.palette.primary.main,
              }}
            >
              GREATLAND
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ '&:hover': { color: theme.palette.primary.main } }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/properties"
              color="inherit"
              sx={{ '&:hover': { color: theme.palette.primary.main } }}
            >
              Properties
            </Button>
            <Button
              component={RouterLink}
              to="/portfolio"
              color="inherit"
              sx={{ '&:hover': { color: theme.palette.primary.main } }}
            >
              Portfolio
            </Button>
            <Button
              component={RouterLink}
              to="/submit-application"
              color="inherit"
              startIcon={<DescriptionIcon />}
              sx={{ 
                '&:hover': { color: theme.palette.primary.main },
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                px: 2
              }}
            >
              Submit Application
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 