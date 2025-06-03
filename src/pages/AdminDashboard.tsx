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
  });

  useEffect(() => {
    fetchProperties();
  }, []);

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

      const response = await fetch(url, {
        method: selectedProperty ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Failed to save property');
      }

      handleCloseDialog();
      fetchProperties();
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

      fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: Array.from(e.target.files)
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange}>
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
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="h2">
              Property Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
            >
              Add New Property
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>${property.price}/month</TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(property)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(property._id)}>
                        <DeleteIcon />
                      </IconButton>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSlotsPropertyId(property._id);
                          setOpenSlotsDialog(true);
                        }}
                        sx={{ ml: 1 }}
                      >
                        Manage Slots
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {activeTab === 1 && (
        <RentalApplications />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProperty ? 'Edit Property' : 'Add New Property'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter a detailed description of the property..."
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
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
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span">
                    Upload Images
                  </Button>
                </label>
                {formData.images.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formData.images.length} image(s) selected
                  </Typography>
                )}
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedProperty ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Viewing Slots Dialog */}
      <Dialog open={openSlotsDialog} onClose={() => setOpenSlotsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Manage Viewing Slots</DialogTitle>
        <DialogContent>
          {slotsPropertyId && <AdminViewingSlots propertyId={slotsPropertyId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSlotsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 