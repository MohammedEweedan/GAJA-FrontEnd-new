import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      colors: {
        gaja: {
          50: string;
          100: string;
          200: string;
          300: string;
          400: string;
          500: string;
          600: string;
          700: string;
          800: string;
          900: string;
        };
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      colors?: {
        gaja?: {
          50?: string;
          100?: string;
          200?: string;
          300?: string;
          400?: string;
          500?: string;
          600?: string;
          700?: string;
          800?: string;
          900?: string;
        };
      };
    };
  }
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: {
            main: '#b7a27d',
            light: '#d4c4a9',
            dark: '#8f7d5e',
            contrastText: '#fff',
          },
          secondary: {
            main: '#334d68',
            light: '#5b7188',
            dark: '#233547',
            contrastText: '#fff',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
        }
      : {
          // Dark mode
          primary: {
            main: '#b7a27d',
            light: '#d4c4a9',
            dark: '#8f7d5e',
            contrastText: 'rgba(0, 0, 0, 0.87)',
          },
          secondary: {
            main: '#5b7188',
            light: '#7f8d9f',
            dark: '#3f4d5f',
            contrastText: '#fff',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
          },
        }),
  },
  typography: {
    fontFamily: '"HSN_Razan_Regular", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.00735em',
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: () => ({
          borderRadius: 8,
          padding: '8px 16px',
          textTransform: 'none' as const,
          fontWeight: 500,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }),
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
  custom: {
    colors: {
      gaja: {
        50: '#334d68',
        100: '#b7a27d',
        200: '#334d68',
        300: '#b7a27d',
        400: '#b7a27d',
        500: '#b7a27d',
        600: '#334d68',
        700: '#b7a27d',
        800: '#334d68',
        900: '#b7a27d',
      },
    },
  },
});

// Export the theme creation function
export const createCustomTheme = (mode: PaletteMode) => {
  return createTheme(getDesignTokens(mode));
};

export default getDesignTokens;
