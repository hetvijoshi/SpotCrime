"use client"

import { AppBar, Toolbar, Typography, Container, Box, Link } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "./globals.css";
import { Helmet } from 'react-helmet';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#635bff', // Stripe-inspired primary color
    },
    secondary: {
      main: '#00d4ff', // DevSpot-inspired secondary color
    },
    background: {
      default: '#f6f9fc', // Light background color
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

// export const metadata = {
//   title: "Crime Spotter",
//   description: "Report and view local crime incidents",
// };

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Crime Spotter
        </Typography>
        <Link href="/" color="inherit" sx={{ mx: 1 }}>Home</Link>
        <Link href="/crimeExplorer" color="inherit" sx={{ mx: 1 }}>Crime Explorer</Link>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          <Link href="#" color="inherit" sx={{ mx: 1 }}>Facebook</Link>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>Twitter</Link>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>Instagram</Link>
          <br />
          <Link href="/contact" color="inherit" sx={{ mx: 1 }}>Contact Us</Link>
          <Link href="/privacy" color="inherit" sx={{ mx: 1 }}>Privacy Policy</Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Helmet>
        <script type='module' src='https://us-east-1.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js'></script>
        {/* <script type='module' src='https://public.tableau.com/javascripts/api/viz_v1.js'></script> */}
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            {children}
          </Container>
          <Footer />
        </body>
      </ThemeProvider>
    </html>
  );
}
