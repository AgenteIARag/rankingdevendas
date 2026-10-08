"use client";

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ff9800" }, // Laranja/Dourado (Vendas)
    secondary: { main: "#f44336" },
    success: { main: "#4caf50" },
    background: { default: "#0d1117", paper: "#161b22" },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MUIThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
