"use client"

import { Typography, Button, Box, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import CrimeExplorerDialog from './components/CrimeExplorerDialog';
import { useState } from 'react';

const Map = dynamic(() => import('./components/HotspotMap'), { ssr: false });

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default function Home() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: theme.palette.background.default 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Crime Hotspots in Los Angeles
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Stay informed about local incidents and keep your community safe
            </Typography>
            <tableau-viz id='tableau-viz' src='https://us-east-1.online.tableau.com/t/jxg4182-9b5d0e511d/views/SPOTCRIMEV1/SPOTCRIME' width='1536' height='655' hide-tabs toolbar='bottom' ></tableau-viz>
            {/* <tableau-viz id='tableau-viz' src='https://public.tableau.com/shared/BS2PPY233?:display_count=n&:origin=viz_share_link' width='1536' height='655' hide-tabs toolbar='bottom' ></tableau-viz> */}
          </Box>
        </Container>
        <CrimeExplorerDialog open={openDialog} onClose={handleCloseDialog} />
      </Box>
    </ThemeProvider>
  );
}
