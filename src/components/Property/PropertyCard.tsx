import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types/property';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface PropertyCardProps {
  property: Property;
  isRented?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isRented = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        borderRadius: { xs: 2, sm: 3, md: 4 },
        boxShadow: { xs: 1, sm: 2, md: 3 },
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        '&:hover': {
          boxShadow: { xs: 4, sm: 6, md: 8 },
          transform: 'translateY(-4px) scale(1.01)',
        },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: { xs: 320, sm: 350, md: 375 },
        m: 'auto',
        cursor: 'pointer',
      }}
    >
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '45%', sm: '50%' },
        bgcolor: '#f5f5f5'
      }}>
        <CardMedia
          component="img"
          image={property.images && property.images.length > 0 ? property.images[0] : '/default-placeholder.png'}
          alt={property.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderTopLeftRadius: { xs: 8, sm: 12, md: 16 },
            borderTopRightRadius: { xs: 8, sm: 12, md: 16 },
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: { xs: 8, sm: 12 },
          left: { xs: 8, sm: 12 },
          display: 'flex',
          gap: 1,
        }}>
          <Chip
            label={isRented ? 'Rented' : 'Available'}
            size="small"
            color={isRented ? 'default' : 'success'}
            sx={{ 
              fontWeight: 'bold', 
              fontSize: { xs: 11, sm: 12, md: 13 },
              height: { xs: 24, sm: 28, md: 32 }
            }}
          />
        </Box>
      </Box>
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1.5, sm: 2 },
        height: { xs: '55%', sm: '50%' },
        overflow: 'hidden'
      }}>
        <Typography 
          variant="h6" 
          fontWeight={600} 
          gutterBottom 
          noWrap
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            mb: { xs: 0.5, sm: 1 }
          }}
        >
          {property.title}
        </Typography>
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1} 
          sx={{ 
            mb: { xs: 0.5, sm: 1 },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }
          }}
        >
          <LocationOnIcon color="action" fontSize="small" />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            noWrap
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {property.address}
          </Typography>
        </Stack>
        <Typography 
          variant="subtitle1" 
          color="primary" 
          fontWeight={700} 
          sx={{ 
            mb: { xs: 0.5, sm: 1 },
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}
        >
          ${property.price.toLocaleString()}/month
        </Typography>
        <Grid container spacing={1} sx={{ mb: { xs: 0.5, sm: 1 } }}>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BedIcon 
                color="action" 
                fontSize="small" 
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
              />
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {property.bedrooms}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BathtubIcon 
                color="action" 
                fontSize="small"
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
              />
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {property.bathrooms}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <SquareFootIcon 
                color="action" 
                fontSize="small"
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
              />
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {property.squareFeet}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            mb: { xs: 0.5, sm: 1 }, 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
            lineHeight: 1.4
          }}
        >
          {property.description}
        </Typography>
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            mb: { xs: 0.5, sm: 1 }, 
            flexWrap: 'wrap',
            '& .MuiChip-root': {
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 20, sm: 24 }
            }
          }}
        >
          {property.amenities.slice(0, 1).map((amenity, idx) => (
            <Chip key={idx} label={amenity} size="small" variant="outlined" />
          ))}
          {property.amenities.length > 1 && (
            <Chip label={`+${property.amenities.length - 1} more`} size="small" variant="outlined" />
          )}
        </Stack>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="medium"
          sx={{ 
            mt: 'auto', 
            borderRadius: { xs: 1.5, sm: 2 }, 
            fontWeight: 600,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            py: { xs: 1, sm: 1.5 },
            textTransform: 'none'
          }}
          onClick={() => navigate(`/property/${property.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;