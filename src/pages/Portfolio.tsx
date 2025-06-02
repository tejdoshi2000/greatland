import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import PropertyCard from '../components/Property/PropertyCard';

const Portfolio: React.FC = () => {
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
      propertyType: 'house' as const,
      status: 'rented' as const,
      isRented: true,
      amenities: ['Ocean View', 'Private Garden', 'Garage'],
      availableDate: '2024-01-01',
      viewingSlots: []
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
      propertyType: 'house' as const,
      status: 'rented' as const,
      isRented: true,
      amenities: ['Garden', 'Modern Kitchen', 'Garage'],
      availableDate: '2024-01-01',
      viewingSlots: []
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
      propertyType: 'house' as const,
      status: 'rented' as const,
      isRented: true,
      amenities: ['Mountain View', 'Private Garden', 'Garage'],
      availableDate: '2024-01-01',
      viewingSlots: []
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
      propertyType: 'house' as const,
      status: 'rented' as const,
      isRented: true,
      amenities: ['Waterfront', 'Private Dock', 'Garage'],
      availableDate: '2024-01-01',
      viewingSlots: []
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
      propertyType: 'house' as const,
      status: 'rented' as const,
      isRented: true,
      amenities: ['City View', 'Modern Kitchen', 'Garage'],
      availableDate: '2024-01-01',
      viewingSlots: []
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
      propertyType: 'house' as const,
      status: 'rented' as const,
      isRented: true,
      amenities: ['Beachfront', 'Modern Kitchen', 'Garage'],
      availableDate: '2024-01-01',
      viewingSlots: []
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Our Portfolio
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Explore our collection of premium properties in Turks and Caicos
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {properties.map((property) => (
          <Grid item xs={12} key={property.id}>
            <PropertyCard property={property} isRented={true} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Portfolio; 