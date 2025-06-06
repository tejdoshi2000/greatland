import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} Greatland Properties. All rights reserved.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 