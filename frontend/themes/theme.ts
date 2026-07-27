import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#111827",
      paper: "#1F2937",
    },

    primary: {
      main: "#818CF8",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#38BDF8",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#34D399",
    },

    error: {
      main: "#F87171",
    },

    warning: {
      main: "#FBBF24",
    },

    info: {
      main: "#60A5FA",
    },

    divider: "#374151",

    text: {
      primary: "#F9FAFB",
      secondary: "#CBD5E1",
    },
  },

  typography: {
    fontFamily: "Inter, sans-serif",

    h5: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },

    h6: {
      fontWeight: 700,
      fontSize: "1.1rem",
    },

    subtitle1: {
      fontWeight: 700,
      fontSize: "1.05rem",
      lineHeight: 1.5,
    },

    subtitle2: {
      fontWeight: 700,
      fontSize: "0.95rem",
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },

    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#273449",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#374151",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#818CF8",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#818CF8",
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#374151",
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },
  },
});

export default theme;
