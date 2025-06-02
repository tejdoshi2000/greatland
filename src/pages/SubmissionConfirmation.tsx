import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle, Description } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SubmissionConfirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            Application Submitted Successfully!
          </Typography>
          
          <Typography variant="body1" paragraph>
            Thank you for submitting your rental application. We have received the following documents:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText primary="Signed Application Form" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText primary="Driver's License" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText primary="Recent Paystubs" />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mb: 3 }}>
            Our team will review your application and get back to you within 2-3 business days. 
            You will receive an email notification once your application has been processed.
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/my-applications')}
            >
              View My Applications
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SubmissionConfirmation; 