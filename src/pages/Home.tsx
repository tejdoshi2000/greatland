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
  useMediaQuery,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      icon: <HomeIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 } }} />,
      title: 'Quality Properties',
      description: 'Discover our carefully curated selection of premium properties in Sacramento.',
    },
    {
      icon: <SearchIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 } }} />,
      title: 'Easy Search',
      description: 'Find your perfect home with our advanced search and filtering options.',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 } }} />,
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
          minHeight: { xs: '100vh', md: '90vh' },
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 2, md: 0 },
          pb: { xs: 4, md: 0 },
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
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ 
                color: 'white', 
                mb: { xs: 3, md: 4 },
                position: 'relative',
                textAlign: { xs: 'center', md: 'left' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -20,
                  left: { xs: '50%', md: -30 },
                  transform: { xs: 'translateX(-50%)', md: 'none' },
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(215, 179, 119, 0.2) 0%, rgba(215, 179, 119, 0) 70%)',
                  zIndex: -1
                }
              }}>
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                    lineHeight: { xs: 1.2, md: 1.1 },
                    mb: { xs: 2, md: 3 }
                  }}
                >
                  Find Your Dream Home in Sacramento
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: { xs: 3, md: 4 }, 
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.4
                  }}
                >
                  Discover luxury properties in Sacramento
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/properties')}
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
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
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  maxWidth: { xs: '100%', sm: '400px' },
                  mx: { xs: 'auto', md: 0 }
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
                      height={isMobile ? "200" : "250"}
                      image={featuredProperty.images && featuredProperty.images.length > 0 ? featuredProperty.images[0] : '/default-placeholder.png'}
                      alt={featuredProperty.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          fontWeight: 600
                        }}
                      >
                        Featured Property
                      </Typography>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        {featuredProperty.title}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        color="primary" 
                        gutterBottom 
                        sx={{ 
                          fontSize: { xs: '1.25rem', sm: '1.5rem' },
                          fontWeight: 700,
                          mb: 2
                        }}
                      >
                        ${featuredProperty.price}/month
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 2, sm: 3 }, 
                        mb: 3,
                        flexWrap: 'wrap'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BedIcon color="action" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {featuredProperty.bedrooms} bd
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BathtubIcon color="action" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {featuredProperty.bathrooms} ba
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SquareFootIcon color="action" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                          <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {featuredProperty.squareFeet} sqft
                          </Typography>
                        </Box>
                      </Box>

                      <Button 
                        variant="outlined" 
                        fullWidth
                        onClick={() => navigate(`/property/${featuredProperty._id}`)}
                        sx={{
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          py: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
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
        py: { xs: 8, md: 12 }, 
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
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: { xs: 2, md: 3 },
                lineHeight: { xs: 1.2, md: 1.1 }
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
                opacity: 0.8,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.5
              }}
            >
              Experience luxury living with our premium properties and exceptional service
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 6 }} sx={{ position: 'relative', zIndex: 1 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Box sx={{ 
                    color: theme.palette.primary.main, 
                    mb: { xs: 2, sm: 3 },
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: '50%',
                    backgroundColor: `${theme.palette.primary.main}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 1, sm: 2 } }}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        lineHeight: 1.7,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
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
        py: { xs: 8, md: 12 }, 
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
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: { xs: 2, md: 3 },
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                lineHeight: { xs: 1.2, md: 1.1 }
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
                opacity: 0.8,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.5
              }}
            >
              Discover what sets us apart in luxury real estate
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                p: { xs: 3, sm: 4 }, 
                height: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    mb: { xs: 1.5, sm: 2 }
                  }}
                >
                  Premium Locations
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'text.secondary', 
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  We offer properties in the most sought-after locations in Turks and Caicos, ensuring the perfect blend of luxury and lifestyle.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                p: { xs: 3, sm: 4 }, 
                height: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    mb: { xs: 1.5, sm: 2 }
                  }}
                >
                  Quality Assurance
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'text.secondary', 
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Every property in our portfolio undergoes rigorous quality checks to ensure the highest standards of luxury living.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                p: { xs: 3, sm: 4 }, 
                height: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    mb: { xs: 1.5, sm: 2 }
                  }}
                >
                  Expert Support
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'text.secondary', 
                    lineHeight: 1.7,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
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