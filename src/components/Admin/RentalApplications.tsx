import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  Collapse
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

type ApplicationStatus = 'generated' | 'pending_payment' | 'pending_submission' | 'submitted' | 'approved' | 'rejected';

interface RentalApplication {
  _id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  isPrincipalApplicant: boolean;
  numberOfAdults: number;
  coApplicantEmails: string[];
  householdId: string;
  status: ApplicationStatus;
  documents: Array<{
    type: string;
    url: string;
    uploadedAt: string;
    documentId?: string;
    description?: string;
  }>;
  documentsSubmitted: boolean;
  applicationDate: string;
  hasPdfBase64: boolean;
  pdfBase64?: string;
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  totalPaymentAmount: number;
  viewingRequested: boolean;
  viewingDate?: string;
  viewingStatus: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DebugApplication {
  id: string;
  applicantName: string;
  status: string;
  createdAt: string;
}

interface DebugListResponse {
  count: number;
  applications: DebugApplication[];
}

interface Application {
  _id: string;
  propertyId: string;
  propertyAddress: string;
  userId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionType: 'view' | 'submit';
  isPrincipalApplicant: boolean;
  applicationGroupId: string | null;
  numberOfCoApplicants: number;
  createdAt: string;
}

interface ApplicationGroup {
  groupId: string;
  propertyId: string;
  propertyAddress: string;
  applications: Application[];
  status: 'pending' | 'approved' | 'rejected';
}

interface Document {
  type: string;
  url: string;
  uploadedAt: string;
}

interface HouseholdGroup {
  householdId: string;
  applications: RentalApplication[];
  principalApplicant?: RentalApplication;
}

const RentalApplications: React.FC = () => {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [groupedApplications, setGroupedApplications] = useState<HouseholdGroup[]>([]);
  const [expandedHouseholds, setExpandedHouseholds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<RentalApplication | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to determine document type
  const getDocumentType = (url: string, type: string): string => {
    if (type) return type;
    
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) return 'image';
    return 'document';
  };

  // Helper function to check if document is an image
  const isImageDocument = (url: string, type: string): boolean => {
    const docType = getDocumentType(url, type);
    return docType === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(url.split('.').pop()?.toLowerCase() || '');
  };

  const fetchApplications = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        setError('Not authenticated');
        return;
      }

      console.log('Fetching applications with token:', token.substring(0, 20) + '...');
      
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.status === 401) {
        console.error('Authentication failed');
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch applications');
      }

      const data = await response.json();
      console.log('Fetched applications:', data);
      setApplications(data);
      groupApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchApplications();
  }, [navigate, fetchApplications]);

  const groupApplications = (apps: RentalApplication[]) => {
    const groups: { [key: string]: HouseholdGroup } = {};

    // First, find all principal applicants
    apps.forEach(app => {
      if (app.isPrincipalApplicant) {
        groups[app.householdId] = {
          householdId: app.householdId,
          applications: [app],
          principalApplicant: app
        };
      }
    });

    // Then, add additional applicants to their households
    apps.forEach(app => {
      if (!app.isPrincipalApplicant) {
        if (groups[app.householdId]) {
          groups[app.householdId].applications.push(app);
        } else {
          // If no household found, create a new group
          groups[app.householdId] = {
            householdId: app.householdId,
            applications: [app]
          };
        }
      }
    });

    setGroupedApplications(Object.values(groups));
  };

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Ensure we have a valid applicationId
      if (!applicationId) {
        console.error('Invalid application ID');
        setSnackbar({
          open: true,
          message: 'Invalid application ID',
          severity: 'error'
        });
        return;
      }

      console.log('Updating application status:', { 
        applicationId, 
        newStatus,
        token: token.substring(0, 20) + '...' // Log partial token for debugging
      });

      const url = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/${applicationId}/status`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.status === 401) {
        console.error('Authentication failed:', {
          status: response.status,
          statusText: response.statusText
        });
        localStorage.removeItem('adminToken');
        navigate('/admin-login');
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Failed to update status:', {
          status: response.status,
          statusText: response.statusText,
          error: data,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(data.error || data.message || 'Failed to update status');
      }

      console.log('Status updated successfully:', data);

      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      setSnackbar({
        open: true,
        message: 'Status updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating status:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to update status',
        severity: 'error'
      });
    }
  };

  const handleViewPdf = (application: RentalApplication) => {
    setSelectedApplication(application);
    setShowPdf(true);
  };

  const handleViewDocuments = (application: RentalApplication) => {
    console.log('Viewing documents for application:', {
      id: application._id,
      applicantName: application.applicantName,
      documentCount: application.documents?.length || 0,
      documents: application.documents?.map(doc => ({
        type: doc.type,
        description: doc.description,
        documentId: doc.documentId,
        url: doc.url,
        uploadedAt: doc.uploadedAt
      })) || []
    });
    setSelectedApplication(application);
    setShowDocuments(true);
  };

  const handleViewDocument = (documentUrl: string, documentType: string) => {
    try {
    // Ensure the URL is absolute and properly formatted
    const absoluteUrl = documentUrl.startsWith('http') 
      ? documentUrl 
      : (process.env.REACT_APP_API_URL || 'http://localhost:5000') + documentUrl;
      
      const detectedType = getDocumentType(documentUrl, documentType);
      
      console.log('Viewing document:', {
        originalUrl: documentUrl,
        absoluteUrl: absoluteUrl,
        documentType: documentType,
        detectedType: detectedType,
        apiUrl: process.env.REACT_APP_API_URL
      });
    setSelectedDocument(absoluteUrl);
      setSelectedDocumentType(detectedType);
    } catch (error) {
      console.error('Error constructing document URL:', error);
      setSnackbar({
        open: true,
        message: 'Error loading document',
        severity: 'error'
      });
    }
  };

  const handlePrintDocument = () => {
    if (!selectedDocument) return;

    try {
      const isImage = isImageDocument(selectedDocument, selectedDocumentType || '');
      
      if (!isImage) {
        // For PDFs and other documents, open in new window for printing
        const printWindow = window.open(selectedDocument, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      } else {
        // For images, create a print-friendly page
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Print Document</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: Arial, sans-serif;
                    text-align: center;
                  }
                  img { 
                    max-width: 100%; 
                    height: auto; 
                    max-height: 90vh;
                    object-fit: contain;
                  }
                  .document-info {
                    margin-bottom: 20px;
                    text-align: left;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                  }
                  @media print {
                    body { padding: 0; }
                    .document-info { margin-bottom: 10px; }
                  }
                </style>
              </head>
              <body>
                <div class="document-info">
                  <h3>Document: ${selectedApplication?.applicantName || 'Unknown Applicant'}</h3>
                  <p>Type: ${selectedDocumentType?.toUpperCase() || 'IMAGE'}</p>
                  <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
                <img src="${selectedDocument}" alt="Document" onload="window.print()" />
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (error) {
      console.error('Error printing document:', error);
      setSnackbar({
        open: true,
        message: 'Error printing document',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = async (applicationId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        return;
      }

      console.log('Starting delete process for application:', applicationId);

      // First check if the server is accessible
      console.log('Checking server accessibility...');
      const testResponse = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications/test');
      console.log('Server test response:', {
        status: testResponse.status,
        ok: testResponse.ok,
        statusText: testResponse.statusText
      });

      if (!testResponse.ok) {
        throw new Error('Server is not accessible');
      }

      // Then check what applications are available
      console.log('Checking available applications...');
      const listResponse = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/rental-applications/debug/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Debug list response:', {
        status: listResponse.status,
        ok: listResponse.ok,
        statusText: listResponse.statusText
      });

      if (!listResponse.ok) {
        const errorData = await listResponse.json();
        console.error('Failed to fetch applications list:', {
          status: listResponse.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Failed to fetch applications list');
      }

      const data = await listResponse.json() as DebugListResponse;
      console.log('Available applications:', {
        count: data.count,
        applications: data.applications
      });
      
      // Check if the application we're trying to delete exists
      const applicationExists = data.applications.some((app: DebugApplication) => app.id === applicationId);
      console.log('Application existence check:', {
        applicationId,
        exists: applicationExists,
        availableIds: data.applications.map((app: DebugApplication) => app.id)
      });

      if (!applicationExists) {
        console.error('Application not found in available applications:', {
          tryingToDelete: applicationId,
          availableIds: data.applications.map((app: DebugApplication) => app.id)
        });
        setSnackbar({
          open: true,
          message: 'Application not found in database',
          severity: 'error'
        });
        return;
      }

      setApplicationToDelete(applicationId);
      setDeleteDialogOpen(true);
    } catch (error) {
      console.error('Error checking applications:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error checking applications',
        severity: 'error'
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        setSnackbar({
          open: true,
          message: 'Not authenticated as admin',
          severity: 'error'
        });
        return;
      }

      console.log('Confirming deletion of application:', applicationToDelete);

      // First verify the application exists
      console.log('Verifying application exists:', applicationToDelete);
      const verifyResponse = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/verify/${applicationToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Verify response:', {
        status: verifyResponse.status,
        ok: verifyResponse.ok,
        statusText: verifyResponse.statusText
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        console.error('Application verification failed:', {
          status: verifyResponse.status,
          error: errorData
        });
        throw new Error(errorData.error || errorData.details || 'Application not found');
      }

      console.log('Application verified, proceeding with delete');
      const url = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/${applicationToDelete}`;
      console.log('Making DELETE request to:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete request failed:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || errorData.details || 'Failed to delete application');
      }

      // Remove the deleted application from the state
      setApplications(prev => prev.filter(app => app._id !== applicationToDelete));
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Application deleted successfully',
        severity: 'success'
      });

      // Refetch applications from backend to ensure UI is up to date
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to delete application',
        severity: 'error'
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setApplicationToDelete(null);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending_payment':
      case 'pending_submission':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (application: RentalApplication) => {
    if (application.status === 'generated') {
      return 'Generated (Pending Documents)';
    }
    if (application.status === 'pending_payment') {
      return 'Pending Payment';
    }
    if (application.status === 'pending_submission') {
      if (application.viewingRequested) {
        return 'Viewing Requested';
      }
      if (application.documentsSubmitted) {
        return 'Documents Submitted';
      }
      return 'Pending Submission';
    }
    return application.status.charAt(0).toUpperCase() + application.status.slice(1);
  };

  const getStatusDescription = (application: RentalApplication) => {
    if (application.status === 'generated') {
      return 'Application generated, waiting for documents';
    }
    if (application.status === 'pending_payment') {
      return 'Waiting for payment';
    }
    if (application.status === 'pending_submission') {
      if (application.viewingRequested) {
        return 'Viewing has been requested';
      }
      if (application.documentsSubmitted) {
        return 'Documents have been submitted';
      }
      return 'Waiting for document submission';
    }
    return '';
  };

  const toggleHousehold = (householdId: string) => {
    const newExpanded = new Set(expandedHouseholds);
    if (newExpanded.has(householdId)) {
      newExpanded.delete(householdId);
    } else {
      newExpanded.add(householdId);
    }
    setExpandedHouseholds(newExpanded);
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Not authenticated as admin',
          severity: 'error'
        });
        return;
      }

      // First verify the application exists
      const verifyResponse = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/verify/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!verifyResponse.ok) {
        throw new Error('Application not found or access denied');
      }

      // Then proceed with deletion
      const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + `/api/rental-applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete application');
      }

      setSnackbar({
        open: true,
        message: 'Application deleted successfully',
        severity: 'success'
      });

      // Refetch applications from backend to ensure UI is up to date
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to delete application',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Rental Applications
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Property</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedApplications.map((group) => (
              <React.Fragment key={group.householdId}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleHousehold(group.householdId)}
                    >
                      {expandedHouseholds.has(group.householdId) ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{group.applications[0].propertyName}</TableCell>
                  <TableCell>{group.applications[0].applicantName}</TableCell>
                  <TableCell>{group.applications[0].applicantEmail}</TableCell>
                  <TableCell>
                    <Chip
                      label={group.applications[0].status}
                      color={getStatusColor(group.applications[0].status)}
                      size="small"
                    />
                    {group.applications[0].paymentStatus === 'completed' ? (
                      <Chip label="Payment Received" color="success" size="small" />
                    ) : (
                      <Chip label="Unpaid" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {group.applications.length} documents
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDocuments(group.applications[0])}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {group.applications.length > 1 && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleStatusChange(group.applications[0]._id, 'approved')}
                          sx={{ ml: 1 }}
                        >
                          Approve All
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleStatusChange(group.applications[0]._id, 'rejected')}
                          sx={{ ml: 1 }}
                        >
                          Reject All
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={expandedHouseholds.has(group.householdId)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Application Details
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Property</TableCell>
                              <TableCell>Applicant</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Documents</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {group.applications.map((app) => (
                              <TableRow key={app._id}>
                                <TableCell>{app.propertyName}</TableCell>
                                <TableCell>{app.applicantName}</TableCell>
                                <TableCell>{app.applicantEmail}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={app.status}
                                    color={getStatusColor(app.status)}
                                    size="small"
                                  />
                                  {app.paymentStatus === 'completed' ? (
                                    <Chip label="Payment Received" color="success" size="small" />
                                  ) : (
                                    <Chip label="Unpaid" color="error" size="small" />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {app.documents.length} documents
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDocuments(app)}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleStatusChange(app._id, 'approved')}
                                    sx={{ ml: 1 }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleStatusChange(app._id, 'rejected')}
                                    sx={{ ml: 1 }}
                                  >
                                    Reject
                                  </Button>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteApplication(app._id)}
                                    sx={{ ml: 1 }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                            {group.principalApplicant && group.principalApplicant.coApplicantEmails && group.principalApplicant.coApplicantEmails.filter(email => !group.applications.some(app => app.applicantEmail === email)).map((email, idx) => {
                              const principal = group.principalApplicant!; // We know it exists because of the condition above
                              return (
                                <TableRow key={email}>
                                  <TableCell>{principal.propertyName}</TableCell>
                                  <TableCell>--</TableCell>
                                  <TableCell>{email}</TableCell>
                                  <TableCell>
                                    <Chip label="Not Submitted" color="warning" size="small" />
                                    {principal.paymentStatus === 'completed' ? (
                                      <Chip label="Payment Received" color="success" size="small" />
                                    ) : (
                                      <Chip label="Unpaid" color="error" size="small" />
                                    )}
                                  </TableCell>
                                  <TableCell>0 documents</TableCell>
                                  <TableCell />
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={showPdf}
        onClose={() => setShowPdf(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Rental Application - {selectedApplication?.applicantName}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && selectedApplication.hasPdfBase64 && selectedApplication.pdfBase64 && (
            <iframe
              src={`data:application/pdf;base64,${selectedApplication.pdfBase64}`}
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title="Rental Application PDF"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPdf(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDocuments}
        onClose={() => setShowDocuments(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Submitted Documents - {selectedApplication?.applicantName}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Grid container spacing={2}>
                {selectedApplication.documents && selectedApplication.documents.map((doc, index) => (
                  <Grid item xs={12} sm={6} key={doc.documentId || index}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {doc.type === 'income' && doc.description 
                          ? doc.description
                          : doc.type.charAt(0).toUpperCase() + doc.type.slice(1) + ' Document'
                        }
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Type: {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Uploaded: {format(new Date(doc.uploadedAt), 'MM/dd/yyyy HH:mm')}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewDocument(doc.url, doc.type)}
                        sx={{ mt: 1 }}
                        fullWidth
                      >
                        View Document
                      </Button>
                    </Paper>
                  </Grid>
                ))}
                {(!selectedApplication.documents || selectedApplication.documents.length === 0) && (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary" align="center">
                      No documents uploaded yet.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDocuments(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!selectedDocument}
        onClose={() => {
          setSelectedDocument(null);
          setSelectedDocumentType(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Document Viewer - {selectedApplication?.applicantName}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {selectedDocumentType?.toUpperCase()} Document
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrintDocument}
              size="small"
            >
              Print
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box sx={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {!isImageDocument(selectedDocument, selectedDocumentType || '') ? (
              <iframe
                src={selectedDocument}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Document Viewer"
              />
              ) : (
                <img
                  src={selectedDocument}
                  alt="Document"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setSelectedDocument(null);
            setSelectedDocumentType(null);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Application
          <IconButton
            aria-label="close"
            onClick={handleDeleteCancel}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this application? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RentalApplications; 