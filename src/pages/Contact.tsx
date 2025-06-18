import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
  Grid,
  InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    contactNumber: '',
    email: '',
    query: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setSuccess('Your message has been sent! We will get back to you soon.');
        setForm({ name: '', contactNumber: '', email: '', query: '' });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box sx={{
        width: '100%',
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
        color: 'white',
        mb: 4,
        textAlign: 'center',
      }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Having trouble? We're here to help!
        </Typography>
      </Box>
      <Container maxWidth="sm" sx={{ pb: 8 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, boxShadow: 6, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom align="center">
            Get in Touch
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Fill out the form below and our team will get back to you as soon as possible.
          </Typography>
          {success && (
            <Alert icon={<CheckCircleOutlineIcon fontSize="inherit" />} severity="success" sx={{ mb: 2, fontWeight: 500, fontSize: 18, textAlign: 'center' }}>{success}</Alert>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contact Number"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Your Query"
                  name="query"
                  value={form.query}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  minRows={4}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HelpOutlineIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ py: 1.5, fontWeight: 600, fontSize: 18 }} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact; 