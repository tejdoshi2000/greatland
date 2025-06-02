import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/properties/available');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Available Properties
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Explore our available properties for rent in Turks and Caicos
        </Typography>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={property._id}>
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
                images: property.images.map(img => `http://localhost:5000${img}`),
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