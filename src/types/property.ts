export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  images: string[];
  amenities: string[];
  availableDate: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  status: 'available' | 'pending' | 'rented';
  isRented: boolean;
  viewingSlots: {
    date: string;
    availableSlots: string[];
  }[];
} 