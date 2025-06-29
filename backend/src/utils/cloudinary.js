const cloudinary = require('cloudinary').v2;

// Only configure cloudinary if all required environment variables are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  console.log('Cloudinary config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: '***',
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('Cloudinary configuration not found. Image upload functionality will be disabled.');
}

module.exports = cloudinary; 