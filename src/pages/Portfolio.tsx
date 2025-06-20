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
  useMediaQuery,
} from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Portfolio: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      images: ['https://res.cloudinary.com/dtwadr8s8/image/upload/v1750388714/3245_Portage_Way_Exterior-9_htwi6u.jpg'],
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
      images: ['https://res.cloudinary.com/dtwadr8s8/image/upload/v1750388714/IMG_8962_uaujyw.jpg'],
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
      images: ['https://res.cloudinary.com/dtwadr8s8/image/upload/v1750388714/241_Picasso_Circle_2_xu6t8b.jpg'],
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
      images: ['https://res.cloudinary.com/dtwadr8s8/image/upload/v1750388714/Mahaska_Pictures_001_av0fqe.jpg'],
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
      images: ['https://res.cloudinary.com/dtwadr8s8/image/upload/v1750388713/03_3652_Odessa_Lane_go2icn.jpg'],
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
      images: ['https://res.cloudinary.com/dtwadr8s8/image/upload/v1750388713/Diorite-1_k9sknb.jpg'],
      amenities: ['Beachfront', 'Modern Kitchen', 'Garage'],
      rentedDate: '2023-07-15'
    }
  ];

  return (
    <Box sx={{ 
      py: { xs: 4, md: 8 },
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 4, md: 8 },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: { xs: -15, md: -20 },
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '60px', sm: '80px', md: '100px' },
            height: { xs: '3px', md: '4px' },
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: '2px'
          }
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: { xs: 1.5, md: 2 },
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              lineHeight: { xs: 1.2, md: 1.1 }
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
              opacity: 0.8,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.5
            }}
          >
            Discover our portfolio of premium properties that have found their perfect tenants
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} lg={4} key={property.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
                    width: '100%',
                    height: { xs: 200, sm: 220, md: 240 }
                  }}
                  image={property.images && property.images.length > 0 ? property.images[0] : '/default-placeholder.png'}
                  alt={property.title}
                />
                <CardContent sx={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: { xs: 2, sm: 2.5, md: 3 }
                }}>
                  <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                        mb: { xs: 0.5, md: 1 }
                      }}
                    >
                      {property.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon 
                        sx={{ 
                          color: 'text.secondary', 
                          mr: 1, 
                          fontSize: { xs: 16, sm: 18, md: 20 } 
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {property.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 2, sm: 3 }, 
                    mb: { xs: 1.5, md: 2 },
                    flexWrap: 'wrap'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BedIcon 
                        color="action" 
                        sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                      />
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {property.bedrooms} bd
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BathtubIcon 
                        color="action"
                        sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                      />
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {property.bathrooms} ba
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SquareFootIcon 
                        color="action"
                        sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                      />
                      <Typography 
                        variant="body2"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {property.squareFeet} sqft
                      </Typography>
                    </Box>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: { xs: 1.5, md: 2 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {property.description}
                  </Typography>

                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ 
                      mb: { xs: 1.5, md: 2 }, 
                      flexWrap: 'wrap', 
                      gap: 1,
                      '& .MuiChip-root': {
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 }
                      }
                    }}
                  >
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
                    pt: { xs: 1.5, md: 2 },
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      Successfully Rented
                    </Typography>
                    <Tooltip title="Successfully Rented">
                      <IconButton 
                        sx={{ 
                          color: 'success.main',
                          p: { xs: 0.5, sm: 1 }
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
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