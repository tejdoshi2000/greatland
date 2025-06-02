import React from 'react';

const property = {
  id: 1,
  name: 'Frigate Bird Residence',
  address: '2946 Frigate Bird Dr, Sacramento, CA 95834',
  image: '/property1.jpg',
  description: 'Beautiful modern home in a quiet neighborhood',
  price: '$2,500/month',
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1800,
  features: [
    'Modern Kitchen',
    'Hardwood Floors',
    'Central AC/Heat',
    'Attached Garage',
    'Private Backyard',
    'Updated Appliances'
  ],
  amenities: [
    'In-Unit Laundry',
    'Dishwasher',
    'Microwave',
    'Refrigerator',
    'Stove/Oven',
    'Garbage Disposal'
  ]
};

export const PropertyDetail: React.FC = () => {
  // Your component logic here
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};

export default PropertyDetail; 