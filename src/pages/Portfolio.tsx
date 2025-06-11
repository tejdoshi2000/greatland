import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Portfolio: React.FC = () => {
  const theme = useTheme();

  const properties = [
    {
      id: 'property-2',
      title: 'Luxury Villa 2',
      address: 'Grace Bay, Turks and Caicos',
      price: 3200,
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 2800,
      description: 'An elegant beachfront property with contemporary design.',
      images: ['/images/3245 Portage Way Exterior-9.jpg'],
      amenities: ['Ocean View', 'Private Garden', 'Garage'],
      rentedDate: '2023-12-01'
    },
    {
      id: 'property-3',
      title: 'Luxury Villa 3',
      address: 'Grace Bay, Turks and Caicos',
      price: 3000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2500,
      description: 'A charming property surrounded by lush gardens.',
      images: ['/images/03_3652 Odessa Lane.jpg'],
      amenities: ['Garden', 'Modern Kitchen', 'Garage'],
      rentedDate: '2023-11-15'
    },
    {
      id: 'property-4',
      title: 'Luxury Villa 4',
      address: 'Grace Bay, Turks and Caicos',
      price: 2800,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2200,
      description: 'A unique property with panoramic views.',
      images: ['/images/Diorite-1.jpg'],
      amenities: ['Mountain View', 'Private Garden', 'Garage'],
      rentedDate: '2023-10-01'
    },
    {
      id: 'property-5',
      title: 'Luxury Villa 5',
      address: 'Grace Bay, Turks and Caicos',
      price: 2600,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 2000,
      description: 'A waterfront property with stunning views.',
      images: ['/images/Mahaska Pictures 001.JPG'],
      amenities: ['Waterfront', 'Private Dock', 'Garage'],
      rentedDate: '2023-09-15'
    },
    {
      id: 'property-6',
      title: 'Luxury Villa 6',
      address: 'Grace Bay, Turks and Caicos',
      price: 2400,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1800,
      description: 'A modern urban property with city views.',
      images: ['/images/IMG_8063.jpeg'],
      amenities: ['City View', 'Modern Kitchen', 'Garage'],
      rentedDate: '2023-08-01'
    },
    {
      id: 'property-7',
      title: 'Luxury Villa 7',
      address: 'Grace Bay, Turks and Caicos',
      price: 2200,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1600,
      description: 'An exclusive beachfront property.',
      images: ['/images/IMG_8962.jpeg'],
      amenities: ['Beachfront', 'Modern Kitchen', 'Garage'],
      rentedDate: '2023-07-15'
    }
  ];

  return (
    <Box sx={{ 
      py: 8,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center', 
          mb: 8,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: '2px'
          }
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2
            }}
          >
            Our Success Stories
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              opacity: 0.8
            }}
          >
            Discover our portfolio of premium properties that have found their perfect tenants
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {properties.map((property) => (
            <Grid item xs={12} md={6} key={property.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ 
                    width: { xs: '100%', md: '40%' },
                    height: { xs: 240, md: 'auto' }
                  }}
                  image={property.images[0]}
                  alt={property.title}
                />
                <CardContent sx={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {property.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {property.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BedIcon color="action" />
                      <Typography variant="body2">{property.bedrooms} bd</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BathtubIcon color="action" />
                      <Typography variant="body2">{property.bathrooms} ba</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SquareFootIcon color="action" />
                      <Typography variant="body2">{property.squareFeet} sqft</Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {property.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    {property.amenities.map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        size="small"
                        sx={{
                          backgroundColor: `${theme.palette.primary.main}15`,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: `${theme.palette.primary.main}25`,
                          }
                        }}
                      />
                    ))}
                  </Stack>

                  <Box sx={{ 
                    mt: 'auto',
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Successfully Rented
                    </Typography>
                    <Tooltip title="Successfully Rented">
                      <IconButton sx={{ color: 'success.main' }}>
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Portfolio; 