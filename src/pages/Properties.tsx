import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PropertyCard from '../components/Property/PropertyCard';

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  images: string[];
  features: string[];
  amenities: string[];
  status: 'available' | 'rented';
}

const Properties: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/properties/available');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: { xs: 2, md: 3 },
            lineHeight: { xs: 1.2, md: 1.1 }
          }}
        >
          Available Properties
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          paragraph
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            lineHeight: 1.5,
            maxWidth: '800px',
            mx: { xs: 'auto', md: 0 }
          }}
        >
          Explore our available properties for rent in Turks and Caicos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {properties.length === 0 && !error && (
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 8 },
          color: 'text.secondary'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No properties available at the moment
          </Typography>
          <Typography variant="body1">
            Please check back later for new listings
          </Typography>
        </Box>
      )}

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {properties.map((property) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={property._id}
            sx={{ display: 'flex' }}
          >
            <PropertyCard 
              property={{
                id: property._id,
                title: property.title,
                address: property.location,
                price: property.price,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                squareFeet: property.squareFeet,
                description: property.description,
                images: property.images,
                propertyType: 'house',
                status: property.status,
                isRented: property.status === 'rented',
                amenities: property.amenities,
                availableDate: new Date().toISOString().split('T')[0],
                viewingSlots: []
              }} 
              isRented={property.status === 'rented'}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Properties; 