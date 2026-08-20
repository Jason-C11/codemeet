import { createTheme } from "@mui/material/styles";

const sharedTheme = {
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
      textTransform: "none" as const,
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
        variant: "outlined" as const,
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
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
};

// --------------------------------------------------
// Slate / Orange Theme
// Default Theme
// --------------------------------------------------

export const slateOrangeTheme = createTheme({
  ...sharedTheme,

  palette: {
    mode: "dark",

    background: {
      default: "#0F1115",
      paper: "#171A21",
    },

    primary: {
      main: "#F97316",
      light: "#FB923C",
      dark: "#EA580C",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#38BDF8",
      light: "#7DD3FC",
      dark: "#0284C7",
      contrastText: "#0F1115",
    },

    success: {
      main: "#22C55E",
    },

    error: {
      main: "#EF4444",
    },

    warning: {
      main: "#F59E0B",
    },

    info: {
      main: "#38BDF8",
    },

    divider: "#2A303B",

    text: {
      primary: "#F3F4F6",
      secondary: "#9CA3AF",
      disabled: "#6B7280",
    },
  },

  components: {
    ...sharedTheme.components,

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#20242C",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2A303B",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F97316",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F97316",
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#2A303B",
        },
      },
    },
  },
});

// --------------------------------------------------
// Indigo / Slate Theme
// --------------------------------------------------

export const indigoSlateTheme = createTheme({
  ...sharedTheme,

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

  components: {
    ...sharedTheme.components,

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
  },
});

// --------------------------------------------------
// Indigo Theme
// --------------------------------------------------

export const indigoTheme = createTheme({
  ...sharedTheme,

  palette: {
    mode: "dark",

    background: {
      default: "#10121A",
      paper: "#181B25",
    },

    primary: {
      main: "#8B7CF6",
      light: "#A99DF8",
      dark: "#6D5CE7",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#6C8CFF",
      light: "#8FA8FF",
      dark: "#4F6FE5",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#4ADE80",
    },

    error: {
      main: "#FB7185",
    },

    warning: {
      main: "#FBBF24",
    },

    info: {
      main: "#60A5FA",
    },

    divider: "#303544",

    text: {
      primary: "#F1F3F9",
      secondary: "#B0B7C8",
      disabled: "#737B8F",
    },
  },

  components: {
    ...sharedTheme.components,

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#222633",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#303544",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B7CF6",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B7CF6",
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#303544",
        },
      },
    },
  },
});

// --------------------------------------------------
// Light Theme
// --------------------------------------------------

export const lightTheme = createTheme({
  ...sharedTheme,

  palette: {
    mode: "light",

    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },

    primary: {
      main: "#4338CA",
      light: "#4F46E5",
      dark: "#3730A3",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#0369A1",
      light: "#0284C7",
      dark: "#075985",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#15803D",
    },

    error: {
      main: "#B91C1C",
    },

    warning: {
      main: "#B45309",
    },

    info: {
      main: "#1D4ED8",
    },

    divider: "#CBD5E1",

    text: {
      primary: "#0F172A",
      secondary: "#475569",
      disabled: "#94A3B8",
    },
  },

  components: {
    ...sharedTheme.components,

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CBD5E1",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4338CA",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4338CA",
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#CBD5E1",
        },
      },
    },
  },
});

// --------------------------------------------------
// Theme Map
// --------------------------------------------------

export const themes = {
  "slate-orange": slateOrangeTheme,
  "indigo-slate": indigoSlateTheme,
  "indigo": indigoTheme,
  "light": lightTheme,
};

export type ThemeName = keyof typeof themes;

export default slateOrangeTheme;