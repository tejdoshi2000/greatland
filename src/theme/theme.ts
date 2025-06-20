import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // Deep blue-gray - sophisticated and professional
      light: '#34495E',
      dark: '#1A252F',
    },
    secondary: {
      main: '#D4AF37', // Warm gold - luxury and elegance
      light: '#E5C76B',
      dark: '#B38F1D',
    },
    background: {
      default: '#FAFAFA', // Lighter background for minimalism
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#6C757D', // Lighter secondary text
    },
    error: {
      main: '#E74C3C',
    },
    success: {
      main: '#27AE60',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Inter for better readability
    fontSize: 14, // Base font size reduced from 16
    h1: {
      fontSize: '2.25rem', // Reduced from default ~3rem
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.875rem', // Reduced from default ~2.5rem
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem', // Reduced from default ~2rem
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem', // Reduced from default ~1.75rem
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem', // Reduced from default ~1.5rem
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem', // Reduced from default ~1.25rem
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem', // Reduced from default 1rem
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem', // Reduced from default 0.875rem
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem', // Smaller button text
    },
    caption: {
      fontSize: '0.75rem', // Smaller caption text
    },
    overline: {
      fontSize: '0.6875rem', // Smaller overline text
    },
  },
  spacing: 4, // Reduce base spacing from 8 to 4 for tighter layout
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Smaller border radius
          padding: '6px 16px', // Reduced padding
          fontSize: '0.875rem',
          minHeight: '36px', // Smaller button height
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', // Subtler shadow
          },
        },
        outlined: {
          borderWidth: '1px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Smaller border radius
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)', // Subtler shadow
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Smaller border radius
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: '0.875rem', // Smaller input text
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem', // Smaller label text
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem', // Smaller menu item text
          padding: '8px 16px', // Reduced padding
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem', // Smaller chip text
          height: '24px', // Smaller chip height
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem', // Smaller alert text
          padding: '8px 12px', // Reduced padding
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          '& .MuiStepLabel-label': {
            fontSize: '0.8125rem', // Smaller stepper label
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px', // Reduced container padding
          paddingRight: '16px',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '&.MuiGrid-container': {
            margin: 0, // Remove default grid margins
          },
        },
      },
    },
  },
});

export default theme; 