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

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 2,
        transition: 'box-shadow 0.3s cubic-bezier(.25,.8,.25,1)',
        '&:hover': {
          boxShadow: 8,
          transform: 'translateY(-4px) scale(1.01)',
        },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 700,
        height: 375,
        m: 'auto',
      }}
    >
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '50%',
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
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          gap: 1,
        }}>
          <Chip
            label={isRented ? 'Rented' : 'Available'}
            size="small"
            color={isRented ? 'default' : 'success'}
            sx={{ fontWeight: 'bold', fontSize: 13 }}
          />
        </Box>
      </Box>
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        height: '50%',
        overflow: 'hidden'
      }}>
        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
          {property.title}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <LocationOnIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary" noWrap>
            {property.address}
          </Typography>
        </Stack>
        <Typography variant="subtitle1" color="primary" fontWeight={700} sx={{ mb: 0.5 }}>
          ${property.price.toLocaleString()}/month
        </Typography>
        <Grid container spacing={1} sx={{ mb: 0.5 }}>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BedIcon color="action" fontSize="small" />
              <Typography variant="body2">{property.bedrooms}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BathtubIcon color="action" fontSize="small" />
              <Typography variant="body2">{property.bathrooms}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <SquareFootIcon color="action" fontSize="small" />
              <Typography variant="body2">{property.squareFeet}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {property.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
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
          sx={{ mt: 'auto', borderRadius: 2, fontWeight: 600 }}
          onClick={() => navigate(`/property/${property.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;