import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
  Divider,
  IconButton,
  Stack,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  CircularProgress,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { RentalApplication } from '../components/RentalApplication/RentalApplication';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import PropertyViewingSlots from '../components/Property/PropertyViewingSlots';

interface PropertyDetail {
  _id: string;
  title: string;
  description: string;
  images: string[];
  features: string[];
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  status: 'available' | 'rented';
}

const GalleryGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRentalApplication, setShowRentalApplication] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }
      const data = await response.json();
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property details');
    } finally {
      setLoading(false);
    }
  };

  // Touch handling for mobile carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const touchDiff = touchStart - touchEnd;

    if (Math.abs(touchDiff) > 50) { // Minimum swipe distance
      if (touchDiff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  const handlePrevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Container>
        <Typography color="error" variant="h5">
          {error || 'Property not found'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/properties')}
          sx={{ mt: 2 }}
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/properties')}
        sx={{ mb: 2 }}
      >
        Back to Properties
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', bgcolor: '#f5f5f5', mb: 2 }}>
            <CardMedia
              component="img"
              image={`http://localhost:5000${property.images[currentImageIndex]}`}
              alt={property.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 2,
                background: '#f5f5f5',
                maxHeight: 500,
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
            {property.images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>
          {/* Gallery Grid */}
          {property.images.length > 1 && (
            <GalleryGrid>
              {property.images.map((img, idx) => (
                <Box
                  key={img}
                  sx={{
                    border: idx === currentImageIndex ? '2px solid #1976d2' : '2px solid transparent',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border 0.2s',
                    boxShadow: idx === currentImageIndex ? 3 : 1,
                  }}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <CardMedia
                    component="img"
                    image={`http://localhost:5000${img}`}
                    alt={`Gallery ${idx + 1}`}
                    sx={{ width: '100%', height: 90, objectFit: 'cover', background: '#f5f5f5' }}
                  />
                </Box>
              ))}
            </GalleryGrid>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h3" component="h1" gutterBottom>
            {property.title}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${property.price}/month
          </Typography>
          <Typography variant="body1" paragraph>
            {property.description}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Property Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Bedrooms" secondary={property.bedrooms} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Bathrooms" secondary={property.bathrooms} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Square Feet" secondary={property.squareFeet} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Location" secondary={property.location} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <List>
              {property.amenities.map((amenity, index) => (
                <ListItem key={index}>
                  <ListItemText primary={amenity} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Viewing Slots Section */}
        <Grid item xs={12}>
          <Box mt={4}>
            {/* Dynamically import the component to avoid SSR issues if any */}
            {property.status === 'available' && (
              <React.Suspense fallback={<div>Loading viewing slots...</div>}>
                <PropertyViewingSlots propertyId={property._id} propertyAddress={property.location} />
              </React.Suspense>
            )}
          </Box>
        </Grid>

        {property.status === 'available' && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => setShowRentalApplication(true)}
            >
              Apply for Rental
            </Button>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={showRentalApplication}
        onClose={() => setShowRentalApplication(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <IconButton
            onClick={() => setShowRentalApplication(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <RentalApplication 
            propertyId={property._id}
            propertyName={property.title}
            propertyAddress={property.location}
            propertyPrice={property.price}
            onClose={() => setShowRentalApplication(false)}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PropertyDetails; 