import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: string[];
  features: string[];
  amenities: string[];
  status: 'available' | 'rented';
}

interface NewProperty {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: string[];
  features: string[];
  amenities: string[];
  status: 'available' | 'rented';
}

const MAX_IMAGES = 50;

const Admin: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState<NewProperty>({
    title: '',
    description: '',
    price: 0,
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    images: [],
    features: [],
    amenities: [],
    status: 'available'
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<number>(0);
  const [totalImages, setTotalImages] = useState<number>(0);
  const [showUploadingMsg, setShowUploadingMsg] = useState(false);
  const [showTooManyImages, setShowTooManyImages] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (files.length > MAX_IMAGES) {
      setShowTooManyImages(true);
      setSelectedFiles(Array.from(files).slice(0, MAX_IMAGES));
      setTotalImages(MAX_IMAGES);
    } else {
      setSelectedFiles(Array.from(files));
      setTotalImages(files.length);
    }
  };

  const handleAddButtonClick = async () => {
    if (isUploading || isSubmitting) {
      setShowUploadingMsg(true);
      return;
    }

    // Validate required fields
    if (!newProperty.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!newProperty.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!newProperty.location.trim()) {
      setError('Location is required');
      return;
    }
    if (newProperty.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (newProperty.bedrooms <= 0) {
      setError('Number of bedrooms must be greater than 0');
      return;
    }
    if (newProperty.bathrooms <= 0) {
      setError('Number of bathrooms must be greater than 0');
      return;
    }
    if (newProperty.squareFeet <= 0) {
      setError('Square footage must be greater than 0');
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setUploadProgress(0);
    setUploadedImages(0);

    try {
      setIsUploading(true);
      const formData = new FormData();
      
      // Add all required fields
      formData.append('title', newProperty.title.trim());
      formData.append('description', newProperty.description.trim());
      formData.append('price', String(newProperty.price));
      formData.append('location', newProperty.location.trim());
      formData.append('bedrooms', String(newProperty.bedrooms));
      formData.append('bathrooms', String(newProperty.bathrooms));
      formData.append('squareFeet', String(newProperty.squareFeet));
      formData.append('status', newProperty.status);

      // Add features and amenities if they exist
      if (newProperty.features && newProperty.features.length > 0) {
        newProperty.features.forEach(f => formData.append('features', f));
      }
      if (newProperty.amenities && newProperty.amenities.length > 0) {
        newProperty.amenities.forEach(a => formData.append('amenities', a));
      }

      // Add images
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      // Debug log
      console.log('Form Data being sent:', {
        title: newProperty.title.trim(),
        description: newProperty.description.trim(),
        price: newProperty.price,
        location: newProperty.location.trim(),
        bedrooms: newProperty.bedrooms,
        bathrooms: newProperty.bathrooms,
        squareFeet: newProperty.squareFeet,
        status: newProperty.status,
        imagesCount: selectedFiles.length
      });

      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin token not found. Please log in as admin.');
      }

      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to add property');
      }

      const result = await response.json();
      console.log('Property created successfully:', result);

      // Reset form on success
      setNewProperty({
        title: '',
        description: '',
        price: 0,
        location: '',
        bedrooms: 0,
        bathrooms: 0,
        squareFeet: 0,
        images: [],
        features: [],
        amenities: [],
        status: 'available'
      });
      setSelectedFiles([]);
      setUploadProgress(100);
      setUploadedImages(selectedFiles.length);
      await fetchProperties();
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err instanceof Error ? err.message : 'Failed to add property');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Admin token not found. Please log in as admin.');
      }

      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete property');
      }

      await fetchProperties();
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  const isFormValid = () => {
    return (
      newProperty.title.trim() !== '' &&
      newProperty.description.trim() !== '' &&
      newProperty.price > 0 &&
      newProperty.location.trim() !== '' &&
      newProperty.bedrooms > 0 &&
      newProperty.bathrooms > 0 &&
      newProperty.squareFeet > 0 &&
      selectedFiles.length > 0
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Panel
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Property
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Title"
              value={newProperty.title}
              onChange={(e) => setNewProperty(prev => ({ ...prev, title: e.target.value }))}
              error={!newProperty.title.trim()}
              helperText={!newProperty.title.trim() ? 'Title is required' : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Description"
              value={newProperty.description}
              onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter a detailed description of the property..."
              error={!newProperty.description.trim()}
              helperText={!newProperty.description.trim() ? 'Description is required' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Price"
              value={newProperty.price}
              onChange={(e) => setNewProperty(prev => ({ ...prev, price: Number(e.target.value) }))}
              error={newProperty.price <= 0}
              helperText={newProperty.price <= 0 ? 'Price must be greater than 0' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Location"
              value={newProperty.location}
              onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
              error={!newProperty.location.trim()}
              helperText={!newProperty.location.trim() ? 'Location is required' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="number"
              label="Bedrooms"
              value={newProperty.bedrooms}
              onChange={(e) => setNewProperty(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
              error={newProperty.bedrooms <= 0}
              helperText={newProperty.bedrooms <= 0 ? 'Number of bedrooms must be greater than 0' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="number"
              label="Bathrooms"
              value={newProperty.bathrooms}
              onChange={(e) => setNewProperty(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
              error={newProperty.bathrooms <= 0}
              helperText={newProperty.bathrooms <= 0 ? 'Number of bathrooms must be greater than 0' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type="number"
              label="Square Feet"
              value={newProperty.squareFeet}
              onChange={(e) => setNewProperty(prev => ({ ...prev, squareFeet: Number(e.target.value) }))}
              error={newProperty.squareFeet <= 0}
              helperText={newProperty.squareFeet <= 0 ? 'Square footage must be greater than 0' : ''}
            />
          </Grid>
          
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageSelect}
              disabled={isUploading || isSubmitting}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={isUploading || isSubmitting}
              >
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </label>
            {selectedFiles.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedFiles.length} image(s) selected
              </Typography>
            )}
            {isSubmitting && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Uploading property and images... {uploadedImages} of {totalImages} ({Math.round(uploadProgress)}%)
                </Typography>
              </Box>
            )}
            {uploadError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {uploadError}
              </Alert>
            )}
            <Snackbar
              open={showTooManyImages}
              autoHideDuration={4000}
              onClose={() => setShowTooManyImages(false)}
              message={`You can only upload up to ${MAX_IMAGES} images per property.`}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddButtonClick}
              disabled={isUploading || isSubmitting || !isFormValid()}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                position: 'relative',
                backgroundColor: isUploading ? '#bdbdbd' : undefined,
                color: isUploading ? '#757575' : undefined,
                pointerEvents: isUploading ? 'none' : 'auto',
                '&.Mui-disabled': {
                  backgroundColor: isUploading ? '#bdbdbd' : undefined,
                  color: isUploading ? '#757575' : undefined,
                }
              }}
            >
              {isUploading ? (
                <>
                  Uploading Images... ({uploadedImages}/{totalImages})
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                </>
              ) : isSubmitting ? 'Adding Property...' : 'Add Property'}
            </Button>
            <Snackbar
              open={showUploadingMsg}
              autoHideDuration={3000}
              onClose={() => setShowUploadingMsg(false)}
              message="Images are still uploading. Please wait until upload is complete."
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Properties
        </Typography>
        <List>
          {properties.map((property) => (
            <ListItem key={property._id}>
              <ListItemText
                primary={property.title}
                secondary={`${property.location} - $${property.price}/month`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProperty(property._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Admin; 