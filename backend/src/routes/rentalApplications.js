const express = require('express');
const router = express.Router();
const RentalApplication = require('../models/RentalApplication');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const Property = require('../models/Property');

// Test endpoint - no auth required (must be before auth middleware)
router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Rental applications API is working' });
});

// Configure multer for PDF storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    // Ensure uploads directory exists
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch(err => cb(err, uploadPath));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'application-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all rental applications
router.get('/', async (req, res) => {
  try {
    const applications = await RentalApplication.find()
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching rental applications:', error);
    res.status(500).json({ message: 'Error fetching rental applications' });
  }
});

// Get applications by household
router.get('/household/:householdId', async (req, res) => {
  try {
    const applications = await RentalApplication.find({ householdId: req.params.householdId })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching household applications:', error);
    res.status(500).json({ message: 'Error fetching household applications' });
  }
});

// Get application by email
router.get('/email/:email', async (req, res) => {
  try {
    const application = await RentalApplication.findOne({ applicantEmail: req.params.email });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Error fetching application by email:', error);
    res.status(500).json({ message: 'Error fetching application' });
  }
});

// Create new rental application
router.post('/', async (req, res) => {
  try {
    const {
      propertyId,
      propertyName,
      propertyAddress,
      applicantName,
      applicantEmail,
      applicantPhone,
      isPrincipalApplicant,
      numberOfAdults,
      coApplicantEmails,
      hasPdfBase64,
      pdfBase64,
      user
    } = req.body;

    // Validate required fields
    if (!propertyId || !propertyName || !applicantName || !applicantEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create new application
    const application = new RentalApplication({
      propertyId,
      propertyName,
      propertyAddress: propertyAddress || property.location,
      applicantName,
      applicantEmail,
      applicantPhone,
      isPrincipalApplicant,
      numberOfAdults: numberOfAdults || 1,
      coApplicantEmails,
      hasPdfBase64,
      pdfBase64,
      status: 'generated',
      user: user || '000000000000000000000000' // Use provided user ID or default
    });

    // If this is a principal applicant, update any existing additional applicants to have the same householdId
    if (isPrincipalApplicant && Array.isArray(coApplicantEmails) && coApplicantEmails.length > 0) {
      // Use the principal's email as the householdId
      const householdId = applicantEmail;
      application.householdId = householdId;
      // Update all additional applicants with matching emails
      await RentalApplication.updateMany(
        {
          applicantEmail: { $in: coApplicantEmails },
          isPrincipalApplicant: false
        },
        { $set: { householdId } }
      );
    }

    await application.save();

    // If this is a co-applicant, check if the principal has already paid for them
    if (!isPrincipalApplicant) {
      // Find the principal for this household
      const principal = await RentalApplication.findOne({
        householdId: application.householdId || applicantEmail, // fallback if not set
        isPrincipalApplicant: true
      });
      if (principal && principal.paymentStatus === 'completed' && principal.coApplicantEmails.includes(applicantEmail)) {
        application.paymentStatus = 'completed';
        if (application.documentsSubmitted) {
          application.status = 'submitted';
        } else {
          application.status = 'pending_submission';
        }
        await application.save();
      }
    }

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating rental application:', error);
    res.status(500).json({ message: 'Error creating rental application' });
  }
});

// Upload document
router.post('/upload-document', upload.single('file'), async (req, res) => {
  try {
    const { applicationId, type, description } = req.body;
    const file = req.file;

    if (!applicationId || !type || !file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('Uploading document:', {
      applicationId,
      type,
      description,
      filename: file.filename,
      path: file.path
    });

    const application = await RentalApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Add document to application with the correct URL path
    const documentUrl = `/uploads/${file.filename}`;
    
    // For income documents, always add as a new document (allow multiple)
    if (type === 'income') {
      application.documents.push({
        type,
        url: documentUrl,
        uploadedAt: new Date(),
        documentId: `${type}_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
        description: description || `Income Document ${new Date().toLocaleDateString()}`
      });
    } else {
      // For other document types, replace if exists, otherwise add new
      const existingDocIndex = application.documents.findIndex(doc => doc.type === type);
      if (existingDocIndex !== -1) {
        // Update existing document
        application.documents[existingDocIndex] = {
          type,
          url: documentUrl,
          uploadedAt: new Date(),
          documentId: `${type}_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
          description: description || ''
        };
      } else {
        // Add new document
        application.documents.push({
          type,
          url: documentUrl,
          uploadedAt: new Date(),
          documentId: `${type}_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
          description: description || ''
        });
      }
    }

    // Update documentsSubmitted status
    application.documentsSubmitted = true;
    application.status = 'pending_payment';

    await application.save();
    
    console.log('Document uploaded successfully:', {
      applicationId,
      documentCount: application.documents.length,
      documents: application.documents
    });

    // Return the updated application with all documents
    const updatedApplication = await RentalApplication.findById(applicationId);
    res.json(updatedApplication);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Error uploading document' });
  }
});

// Update application status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await RentalApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Error updating application status' });
  }
});

// Get all rental applications (admin only)
router.get('/admin', auth, async (req, res) => {
  try {
    console.log('Admin route accessed:', {
      user: req.user,
      isAdmin: req.user.isAdmin,
      headers: req.headers
    });

    if (!req.user.isAdmin) {
      console.log('Access denied: User is not admin');
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find all applications, including those that are generated but not yet submitted
    const applications = await RentalApplication.find()
      .sort({ createdAt: -1 })
      .populate('propertyId', 'name address');
    
    console.log('Found applications:', {
      total: applications.length,
      byStatus: applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}),
      applications: applications.map(app => ({
        id: app._id,
        status: app.status,
        applicantName: app.applicantName,
        documentsSubmitted: app.documentsSubmitted,
        documentCount: app.documents.length,
        documents: app.documents,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt
      }))
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching rental applications:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to fetch rental applications' });
  }
});

// Get a single rental application
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await RentalApplication.findById(req.params.id)
      .populate('propertyId', 'name address');
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is admin or the applicant
    if (!req.user.isAdmin && application.applicantEmail !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching rental application:', error);
    res.status(500).json({ error: 'Failed to fetch rental application' });
  }
});

// Update application status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const applicationId = req.params.id;
    console.log('Received status update request:', {
      applicationId,
      newStatus: req.body.status,
      user: req.user,
      headers: req.headers,
      method: req.method,
      path: req.path,
      body: req.body,
      url: req.originalUrl
    });

    if (!req.user.isAdmin) {
      console.log('Access denied: User is not admin', {
        userId: req.user._id,
        isAdmin: req.user.isAdmin
      });
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    if (!status) {
      console.log('Bad request: Status is missing', {
        body: req.body,
        params: req.params
      });
      return res.status(400).json({ error: 'Status is required' });
    }

    // Validate status value
    const validStatuses = ['generated', 'pending_payment', 'pending_submission', 'submitted', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      console.log('Invalid status value:', status);
      return res.status(400).json({ error: 'Invalid status value' });
    }

    console.log('Looking for application with ID:', applicationId);
    const application = await RentalApplication.findById(applicationId);
    
    if (!application) {
      console.log('Application not found:', {
        id: applicationId,
        status: status
      });
      return res.status(404).json({ 
        error: 'Application not found',
        details: `No application found with ID: ${applicationId}`
      });
    }

    console.log('Found application:', {
      id: application._id,
      currentStatus: application.status
    });

    // Update the status
    application.status = status;
    application.updatedAt = new Date();
    await application.save();

    console.log('Application status updated successfully:', {
      id: application._id,
      oldStatus: application.status,
      newStatus: status,
      updatedAt: application.updatedAt
    });
    
    res.status(200).json({
      success: true,
      application: {
        _id: application._id,
        status: application.status,
        updatedAt: application.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating application status:', {
      error: error.message,
      stack: error.stack,
      applicationId: req.params.id,
      status: req.body.status
    });
    res.status(500).json({ 
      error: 'Failed to update application status',
      details: error.message 
    });
  }
});

// Request viewing (new route)
router.post('/:id/request-viewing', auth, async (req, res) => {
  try {
    const { viewingDate } = req.body;
    const application = await RentalApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.viewingRequested = true;
    application.viewingDate = viewingDate;
    application.viewingStatus = 'pending';
    application.status = 'pending_submission';
    await application.save();

    res.json({
      success: true,
      application: {
        _id: application._id,
        viewingRequested: application.viewingRequested,
        viewingDate: application.viewingDate,
        viewingStatus: application.viewingStatus,
        status: application.status
      }
    });
  } catch (error) {
    console.error('Error requesting viewing:', error);
    res.status(500).json({ error: 'Failed to request viewing' });
  }
});

// Update viewing status (admin only)
router.put('/:id/viewing-status', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { viewingStatus } = req.body;
    const application = await RentalApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.viewingStatus = viewingStatus;
    await application.save();

    res.json({
      success: true,
      application: {
        _id: application._id,
        viewingStatus: application.viewingStatus
      }
    });
  } catch (error) {
    console.error('Error updating viewing status:', error);
    res.status(500).json({ error: 'Failed to update viewing status' });
  }
});

// Submit documents (new route)
router.post('/:id/submit-documents', auth, async (req, res) => {
  try {
    const { documents } = req.body;
    const application = await RentalApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.documents = documents;
    application.documentsSubmitted = true;

    // If payment is completed, mark as submitted
    if (application.paymentStatus === 'completed') {
      application.status = 'submitted';
    } else {
      application.status = 'pending_payment';
    }

    await application.save();

    res.json({
      success: true,
      application: {
        _id: application._id,
        documentsSubmitted: application.documentsSubmitted,
        status: application.status
      }
    });
  } catch (error) {
    console.error('Error submitting documents:', error);
    res.status(500).json({ error: 'Failed to submit documents' });
  }
});

// Find application by property and email
router.get('/find/:propertyId/:email', auth, async (req, res) => {
  try {
    const { propertyId, email } = req.params;
    const application = await RentalApplication.findOne({
      propertyId,
      applicantEmail: email,
      status: 'generated'
    });

    if (!application) {
      return res.status(404).json({ error: 'No generated application found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error finding application:', error);
    res.status(500).json({ error: 'Failed to find application' });
  }
});

// Update existing application with documents
router.put('/:id/documents', auth, async (req, res) => {
  try {
    const application = await RentalApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is the applicant
    if (application.applicantEmail !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { documents } = req.body;
    application.documents = documents;
    application.documentsSubmitted = true;
    application.status = 'pending_submission';
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Error updating application documents:', error);
    res.status(500).json({ error: 'Failed to update application documents' });
  }
});

// Delete individual document
router.delete('/:applicationId/document/:documentId', async (req, res) => {
  try {
    const { applicationId, documentId } = req.params;

    const application = await RentalApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Find the document to delete
    const documentIndex = application.documents.findIndex(doc => doc.documentId === documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const documentToDelete = application.documents[documentIndex];

    // Delete the file from the filesystem (only if it exists)
    if (documentToDelete.url) {
      try {
        // Handle both local and Render deployment paths
        const filePath = path.join(__dirname, '../../', documentToDelete.url);
        await fs.access(filePath); // Check if file exists
        await fs.unlink(filePath);
        console.log('Document file deleted:', filePath);
      } catch (error) {
        console.error('Error deleting document file:', error);
        // Continue with database deletion even if file deletion fails
        // This is especially important for Render where files might be in different locations
      }
    }

    // Remove the document from the application
    application.documents.splice(documentIndex, 1);

    // Update documentsSubmitted status if no documents remain
    if (application.documents.length === 0) {
      application.documentsSubmitted = false;
      application.status = 'generated';
    }

    await application.save();

    console.log('Document deleted successfully:', {
      applicationId,
      documentId,
      remainingDocuments: application.documents.length
    });

    res.json({
      success: true,
      message: 'Document deleted successfully',
      remainingDocuments: application.documents.length
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

// Delete a rental application (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Delete request received:', {
      applicationId: req.params.id,
      user: req.user,
      isAdmin: req.user.isAdmin
    });

    if (!req.user.isAdmin) {
      console.log('Access denied: User is not admin');
      return res.status(403).json({ error: 'Access denied' });
    }

    const application = await RentalApplication.findById(req.params.id);
    
    if (!application) {
      console.log('Application not found:', req.params.id);
      return res.status(404).json({ 
        error: 'Application not found',
        details: `No application found with ID: ${req.params.id}`
      });
    }

    console.log('Found application to delete:', {
      id: application._id,
      propertyId: application.propertyId,
      applicantName: application.applicantName
    });

    // Delete any associated documents
    if (application.documents && application.documents.length > 0) {
      for (const doc of application.documents) {
        if (doc.url) {
          try {
            // Handle both local and Render deployment paths
            const filePath = path.join(__dirname, '../../', doc.url);
            await fs.access(filePath); // Check if file exists
            await fs.unlink(filePath);
            console.log('Document file deleted:', filePath);
          } catch (error) {
            console.error('Error deleting document file:', error);
            // Continue with deletion even if file deletion fails
            // This is especially important for Render where files might be in different locations
          }
        }
      }
    }

    // Delete the application from the database
    await RentalApplication.findByIdAndDelete(req.params.id);
    console.log('Application deleted from database successfully');

    res.json({ 
      success: true,
      message: 'Application deleted successfully',
      applicationId: req.params.id
    });
  } catch (error) {
    console.error('Error deleting application:', {
      error: error.message,
      stack: error.stack,
      applicationId: req.params.id
    });
    res.status(500).json({ 
      error: 'Failed to delete application',
      details: error.message 
    });
  }
});

// Verify application exists (admin only)
router.get('/verify/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const application = await RentalApplication.findById(req.params.id);
    console.log('Verifying application:', {
      id: req.params.id,
      exists: !!application,
      application: application ? {
        id: application._id,
        status: application.status,
        applicantName: application.applicantName
      } : null
    });

    if (!application) {
      return res.status(404).json({ 
        error: 'Application not found',
        details: `No application found with ID: ${req.params.id}`
      });
    }

    res.json({ 
      exists: true,
      application: {
        id: application._id,
        status: application.status,
        applicantName: application.applicantName
      }
    });
  } catch (error) {
    console.error('Error verifying application:', error);
    res.status(500).json({ error: 'Failed to verify application' });
  }
});

// Debug endpoint to list all applications (admin only)
router.get('/debug/list', auth, async (req, res) => {
  try {
    console.log('Debug list endpoint accessed by user:', {
      userId: req.user._id,
      isAdmin: req.user.isAdmin,
      headers: req.headers
    });

    if (!req.user.isAdmin) {
      console.log('Access denied: User is not admin');
      return res.status(403).json({ error: 'Access denied' });
    }

    const applications = await RentalApplication.find({}, '_id applicantName status createdAt');
    console.log('Database query result:', {
      count: applications.length,
      applications: applications.map(app => ({
        id: app._id.toString(),
        applicantName: app.applicantName,
        status: app.status,
        createdAt: app.createdAt
      }))
    });

    res.json({
      count: applications.length,
      applications: applications.map(app => ({
        id: app._id.toString(),
        applicantName: app.applicantName,
        status: app.status,
        createdAt: app.createdAt
      }))
    });
  } catch (error) {
    console.error('Error listing applications:', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to list applications' });
  }
});

// Calculate application fee for an applicant
router.get('/:id/fee', async (req, res) => {
  try {
    const application = await RentalApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const APPLICATION_FEE = 48; // $48 per adult

    // If principal applicant
    if (application.isPrincipalApplicant) {
      const totalAdults = application.numberOfAdults || 1;
      const coApplicantEmails = application.coApplicantEmails || [];
      
      // Find all co-applicant applications for this household
      const coApps = await RentalApplication.find({
        applicantEmail: { $in: coApplicantEmails },
        householdId: application.householdId
      });

      // Calculate total due based on all adults
      const totalDue = totalAdults * APPLICATION_FEE;

      res.json({
        role: 'principal',
        totalDue,
        breakdown: {
          principal: application.paymentStatus === 'completed' ? 'paid' : 'unpaid',
          coApplicants: coApplicantEmails.map(email => {
            const coApp = coApps.find(app => app.applicantEmail === email);
            return {
              email,
              status: coApp?.paymentStatus === 'completed' ? 'paid' : 'unpaid'
            };
          })
        },
        message: application.paymentStatus === 'completed'
          ? 'All application fees for this household have been paid.'
          : `You need to pay for all ${totalAdults} adult${totalAdults !== 1 ? 's' : ''} ($${totalDue}).`
      });
    } else {
      // Co-applicant
      // Find principal for this household
      const principal = await RentalApplication.findOne({
        householdId: application.householdId,
        isPrincipalApplicant: true
      });

      // If principal has paid
      if (principal && principal.paymentStatus === 'completed') {
        return res.json({
          role: 'coapplicant',
          totalDue: 0,
          message: 'Your application fee has been paid by your principal applicant.'
        });
      }

      // If principal hasn't paid yet
      return res.json({
        role: 'coapplicant',
        totalDue: 0,
        message: 'Your principal applicant needs to pay the application fee for all applicants.'
      });
    }
  } catch (error) {
    console.error('Error calculating application fee:', error);
    res.status(500).json({ message: 'Error calculating application fee' });
  }
});

module.exports = router; 