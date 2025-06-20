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
  Chip,
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
  numBeds?: number;
  numBaths?: number;
  sqftArea?: number;
  incomeQualification?: string;
  creditScoreEligible?: string;
  petPolicy?: string;
  securityDeposit?: string;
  utilitiesPaidBy?: string;
  hoaPaidBy?: string;
}

const GalleryGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: theme.spacing(2),
  },
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
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/properties/${id}`);
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
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Container sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          color="error" 
          variant="h5"
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            mb: 2
          }}
        >
          {error || 'Property not found'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/properties')}
          sx={{ 
            mt: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 4 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/properties')}
        sx={{ 
          mb: { xs: 2, md: 3 },
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}
      >
        Back to Properties
      </Button>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12}>
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            aspectRatio: { xs: '4/3', sm: '16/9' }, 
            bgcolor: '#f5f5f5', 
            mb: { xs: 2, md: 3 },
            borderRadius: { xs: 1, sm: 2 }
          }}>
            <CardMedia
              component="img"
              image={property.images && property.images.length > 0 ? property.images[currentImageIndex] : '/default-placeholder.png'}
              alt={property.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: { xs: 1, sm: 2 },
                background: '#f5f5f5',
                maxHeight: { xs: 300, sm: 400, md: 500 },
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
                    left: { xs: 4, sm: 8 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                    p: { xs: 0.5, sm: 1 }
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: { xs: 4, sm: 8 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                    p: { xs: 0.5, sm: 1 }
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
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
                    borderRadius: { xs: 1, sm: 2 },
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border 0.2s',
                    boxShadow: idx === currentImageIndex ? 3 : 1,
                  }}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <CardMedia
                    component="img"
                    image={img}
                    alt={`Gallery ${idx + 1}`}
                    sx={{ 
                      width: '100%', 
                      height: { xs: 60, sm: 90 }, 
                      objectFit: 'cover', 
                      background: '#f5f5f5' 
                    }}
                  />
                </Box>
              ))}
            </GalleryGrid>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: { xs: 1, md: 2 }
            }}
          >
            {property.title}
          </Typography>
          <Typography 
            variant="h4" 
            color="primary" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              fontWeight: 600,
              mb: { xs: 1, md: 2 }
            }}
          >
            ${property.price}/month
          </Typography>
          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.6,
              mb: { xs: 2, md: 3 }
            }}
          >
            {property.description}
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: { xs: 2, md: 3 },
            borderRadius: { xs: 1, sm: 2 }
          }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 600,
                mb: { xs: 1.5, md: 2 }
              }}
            >
              Property Details & Features
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Bedrooms
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span role="img" aria-label="bed">🛏</span>
                  <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {property.numBeds ?? property.bedrooms}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Bathrooms
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span role="img" aria-label="bath">🛁</span>
                  <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {property.numBaths ?? property.bathrooms}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Sqft Area
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span role="img" aria-label="area">📐</span>
                  <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {property.sqftArea ?? property.squareFeet}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: { xs: 1.5, md: 2 } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {property.amenities && property.amenities.length > 0 ? property.amenities.map((a, i) => (
                    <Chip 
                      key={i} 
                      label={a} 
                      size="small"
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        height: { xs: 24, sm: 28 }
                      }}
                    />
                  )) : (
                    <Typography 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      No amenities listed
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Landlord's Criteria
                </Typography>
                <Box component="ul" sx={{ 
                  margin: 0, 
                  paddingLeft: 2,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  <li>Income Qualification: {property.incomeQualification || 'N/A'}</li>
                  <li>Credit Score Eligible: {property.creditScoreEligible || 'N/A'}</li>
                  <li>Pet Policy: {property.petPolicy || 'N/A'}</li>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Financials
                </Typography>
                <Box component="ul" sx={{ 
                  margin: 0, 
                  paddingLeft: 2,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  <li>Security Deposit: {property.securityDeposit || 'N/A'}</li>
                  <li>Utilities Paid By: {property.utilitiesPaidBy || 'N/A'}</li>
                  <li>HOA Paid By: {property.hoaPaidBy || 'N/A'}</li>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Location
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {property.location}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Viewing Slots Section */}
        <Grid item xs={12}>
          <Box mt={{ xs: 2, md: 4 }}>
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
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem' },
                py: { xs: 1.5, sm: 2 },
                borderRadius: { xs: 1.5, sm: 2 }
              }}
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
        PaperProps={{
          sx: {
            m: { xs: 2, sm: 4 },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
          <IconButton
            onClick={() => setShowRentalApplication(false)}
            sx={{ 
              position: 'absolute', 
              right: { xs: 4, sm: 8 }, 
              top: { xs: 4, sm: 8 },
              zIndex: 1
            }}
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