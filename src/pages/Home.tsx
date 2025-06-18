import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [featuredProperty, setFeaturedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProperty();
  }, []);

  const fetchFeaturedProperty = async () => {
    try {
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/properties/available');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const properties = await response.json();
      // Get the first available property as featured
      const availableProperty = properties.find((p: Property) => p.status === 'available');
      setFeaturedProperty(availableProperty || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured property');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <HomeIcon sx={{ fontSize: 40 }} />,
      title: 'Quality Properties',
      description: 'Discover our carefully curated selection of premium properties in Sacramento.',
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Search',
      description: 'Find your perfect home with our advanced search and filtering options.',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      title: 'Simple Application',
      description: 'Apply for your desired property online with our streamlined application process.',
    },
  ];

  return (
    <Box>
      {/* Hero Section with Background */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(
                135deg,
                ${theme.palette.primary.main} 0%,
                rgba(43, 65, 98, 0.95) 50%,
                rgba(215, 179, 119, 0.8) 100%
              )
            `,
            opacity: 0.97,
            zIndex: -1
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ 
                color: 'white', 
                mb: 4,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -20,
                  left: -30,
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(215, 179, 119, 0.2) 0%, rgba(215, 179, 119, 0) 70%)',
                  zIndex: -1
                }
              }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ 
                  fontWeight: 700,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}>
                  Find Your Dream Home in Sacramento
                </Typography>
                <Typography variant="h5" sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                  Discover luxury properties in Sacramento
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/properties')}
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                    }
                  }}
                >
                  View Available Properties
                </Button>
              </Box>
            </Grid>

            {/* Featured Property Card */}
            <Grid item xs={12} md={5}>
              <Card 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                  </Alert>
                ) : featuredProperty ? (
                  <>
                    <CardMedia
                      component="img"
                      height="300"
                      image={featuredProperty.images && featuredProperty.images.length > 0 ? featuredProperty.images[0] : '/default-placeholder.png'}
                      alt={featuredProperty.title}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
                        Featured Property
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {featuredProperty.title}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ${featuredProperty.price}/month
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BedIcon color="action" />
                          <Typography>{featuredProperty.bedrooms} bd</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BathtubIcon color="action" />
                          <Typography>{featuredProperty.bathrooms} ba</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SquareFootIcon color="action" />
                          <Typography>{featuredProperty.squareFeet} sqft</Typography>
                        </Box>
                      </Box>

                      <Button 
                        variant="outlined" 
                        fullWidth
                        onClick={() => navigate(`/property/${featuredProperty._id}`)}
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.dark,
                            backgroundColor: 'rgba(43, 65, 98, 0.05)'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </>
                ) : (
                  <Alert severity="info" sx={{ m: 2 }}>
                    No featured property available at the moment.
                  </Alert>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: 12, 
        backgroundColor: 'white',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(248,249,250,0.5) 0%, rgba(255,255,255,1) 100%)',
          zIndex: 0
        }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8, position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2
              }}
            >
              Why Choose Greatland Properties?
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
              Experience luxury living with our premium properties and exceptional service
            </Typography>
          </Box>

          <Grid container spacing={6} sx={{ position: 'relative', zIndex: 1 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  p: 4,
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    color: theme.palette.primary.main, 
                    mb: 3,
                    p: 2,
                    borderRadius: '50%',
                    backgroundColor: `${theme.palette.primary.main}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        mb: 2
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ 
        py: 12, 
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 0% 0%, ${theme.palette.secondary.main}15 0%, transparent 50%),
                      radial-gradient(circle at 100% 100%, ${theme.palette.primary.main}15 0%, transparent 50%)`,
          opacity: 0.8
        }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2
              }}
            >
              The Greatland Difference
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
              Discover what sets us apart in luxury real estate
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                height: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Premium Locations
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  We offer properties in the most sought-after locations in Turks and Caicos, ensuring the perfect blend of luxury and lifestyle.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                height: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Quality Assurance
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Every property in our portfolio undergoes rigorous quality checks to ensure the highest standards of luxury living.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                height: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Expert Support
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  Our dedicated team of real estate experts provides personalized guidance throughout your journey to find the perfect home.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 