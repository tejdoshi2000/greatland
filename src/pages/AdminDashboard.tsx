import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminViewingSlots from '../components/Admin/AdminViewingSlots';
import RentalApplications from '../components/Admin/RentalApplications';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  status: 'available' | 'rented';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
}

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [error, setError] = useState('');
  const [openSlotsDialog, setOpenSlotsDialog] = useState(false);
  const [slotsPropertyId, setSlotsPropertyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    description: '',
    features: '',
    amenities: '',
    images: [] as File[],
    numBeds: '',
    numBaths: '',
    sqftArea: '',
    incomeQualification: '',
    creditScoreEligible: '',
    petPolicy: '',
    securityDeposit: '',
    utilitiesPaidBy: '',
    hoaPaidBy: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  // Reset form data when dialog opens/closes
  useEffect(() => {
    if (!openDialog) {
      // Reset form when dialog closes
      setFormData({
        title: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        squareFeet: '',
        description: '',
        features: '',
        amenities: '',
        images: [],
        numBeds: '',
        numBaths: '',
        sqftArea: '',
        incomeQualification: '',
        creditScoreEligible: '',
        petPolicy: '',
        securityDeposit: '',
        utilitiesPaidBy: '',
        hoaPaidBy: '',
      });
      setSelectedProperty(null);
    }
  }, [openDialog]);

  const fetchProperties = async () => {
    try {
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    }
  };

  const handleOpenDialog = (property?: Property) => {
    if (property) {
      setSelectedProperty(property);
      setFormData({
        title: property.title,
        price: property.price.toString(),
        location: property.location,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        squareFeet: property.squareFeet.toString(),
        description: '',
        features: '',
        amenities: '',
        images: [],
        numBeds: '',
        numBaths: '',
        sqftArea: '',
        incomeQualification: '',
        creditScoreEligible: '',
        petPolicy: '',
        securityDeposit: '',
        utilitiesPaidBy: '',
        hoaPaidBy: '',
      });
    } else {
      setSelectedProperty(null);
      setFormData({
        title: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        squareFeet: '',
        description: '',
        features: '',
        amenities: '',
        images: [],
        numBeds: '',
        numBaths: '',
        sqftArea: '',
        incomeQualification: '',
        creditScoreEligible: '',
        petPolicy: '',
        securityDeposit: '',
        utilitiesPaidBy: '',
        hoaPaidBy: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProperty(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formDataObj = new FormData();
      
      // Handle non-image fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataObj.append(key, value as string);
        }
      });

      // Handle image files
      formData.images.forEach((file, index) => {
        formDataObj.append('images', file);
      });

      const url = selectedProperty
        ? (process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/properties/${selectedProperty._id}`
        : (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/properties';

      const method = selectedProperty ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Failed to save property');
      }

      await fetchProperties();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save property');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      await fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  const handleUploadButtonClick = () => {
    console.log('Upload button clicked in AdminDashboard');
    
    // Check browser compatibility
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('Your browser does not support file uploads. Please use a modern browser like Chrome, Firefox, or Edge.');
      return;
    }
    
    try {
      // Create a temporary file input element
      const tempInput = document.createElement('input');
      tempInput.type = 'file';
      tempInput.accept = 'image/*';
      tempInput.multiple = true;
      tempInput.style.display = 'none';
      
      // Add event listener with error handling
      tempInput.addEventListener('change', (e) => {
        try {
          const target = e.target as HTMLInputElement;
          console.log('Temporary file input onChange triggered. Files:', target?.files);
          if (target && target.files) {
            setFormData({
              ...formData,
              images: Array.from(target.files)
            });
          }
        } catch (err) {
          console.error('Error handling file selection:', err);
          alert('Error selecting files. Please try again.');
        } finally {
          // Clean up
          document.body.removeChild(tempInput);
        }
      });
      
      // Add to DOM and trigger click
      document.body.appendChild(tempInput);
      console.log('Triggering click on temporary input');
      tempInput.click();
      
    } catch (err) {
      console.error('Error creating file input:', err);
      alert('Error creating file upload. Please try again.');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 4 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: { xs: 1, md: 2 }
          }}
        >
          Admin Dashboard
        </Typography>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.9rem', sm: '1rem' },
              minHeight: { xs: 48, sm: 56 }
            }
          }}
        >
          <Tab label="Properties" />
          <Tab label="Rental Applications" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {activeTab === 0 && (
        <>
          <Box sx={{ 
            mb: { xs: 3, md: 4 }, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                fontWeight: 600
              }}
            >
              Property Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 }
              }}
            >
              Add New Property
            </Button>
          </Box>
          
          {isMobile ? (
            // Mobile card view
            <Grid container spacing={2}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} key={property._id}>
                  <Card sx={{ p: 2 }}>
                    <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        {property.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {property.location}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="primary"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          mb: 1
                        }}
                      >
                        ${property.price}/month
                      </Typography>
                      <Chip 
                        label={property.status} 
                        color={property.status === 'available' ? 'success' : 'default'}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenDialog(property)}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(property._id)}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSlotsPropertyId(property._id);
                            setOpenSlotsDialog(true);
                          }}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                        >
                          Slots
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Desktop table view
            <TableContainer component={Paper} sx={{ boxShadow: { xs: 1, sm: 2 } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Price
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        {property.title}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        {property.location}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        ${property.price}/month
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={property.status} 
                          color={property.status === 'available' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                          <IconButton 
                            onClick={() => handleOpenDialog(property)}
                            size="small"
                          >
                            <EditIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(property._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                          </IconButton>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSlotsPropertyId(property._id);
                              setOpenSlotsDialog(true);
                            }}
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              px: { xs: 1, sm: 1.5 }
                            }}
                          >
                            Manage Slots
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {activeTab === 1 && (
        <RentalApplications />
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 2, sm: 4 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600
        }}>
          {selectedProperty ? 'Edit Property' : 'Add New Property'}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={isSmallMobile ? 3 : 4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter a detailed description of the property..."
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Square Feet"
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    mt: 2, 
                    mb: 1,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  Facts & Features
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Income Qualification"
                  fullWidth
                  value={formData.incomeQualification}
                  onChange={e => setFormData({ ...formData, incomeQualification: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Credit Score Eligible"
                  fullWidth
                  value={formData.creditScoreEligible}
                  onChange={e => setFormData({ ...formData, creditScoreEligible: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pet Policy"
                  fullWidth
                  value={formData.petPolicy}
                  onChange={e => setFormData({ ...formData, petPolicy: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Security Deposit"
                  fullWidth
                  value={formData.securityDeposit}
                  onChange={e => setFormData({ ...formData, securityDeposit: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Utilities Paid By"
                  fullWidth
                  value={formData.utilitiesPaidBy}
                  onChange={e => setFormData({ ...formData, utilitiesPaidBy: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="HOA Paid By"
                  fullWidth
                  value={formData.hoaPaidBy}
                  onChange={e => setFormData({ ...formData, hoaPaidBy: e.target.value })}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={handleUploadButtonClick}
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    py: { xs: 1, sm: 1.5 }
                  }}
                >
                  Upload Images
                </Button>
                {formData.images.length > 0 && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {formData.images.length} image(s) selected
                  </Typography>
                )}
              </Grid>
            </Grid>
            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button 
                onClick={handleCloseDialog}
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                {selectedProperty ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Viewing Slots Dialog */}
      <Dialog 
        open={openSlotsDialog} 
        onClose={() => setOpenSlotsDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 2, sm: 4 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600
        }}>
          Manage Viewing Slots
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {slotsPropertyId && <AdminViewingSlots propertyId={slotsPropertyId} />}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 } }}>
          <Button 
            onClick={() => setOpenSlotsDialog(false)}
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 