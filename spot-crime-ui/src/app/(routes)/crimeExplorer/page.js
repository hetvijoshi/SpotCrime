"use client"

import React, { useState } from 'react'
import { Container, Typography, Box, Paper, Button, ThemeProvider, createTheme } from '@mui/material'
import CrimePost from '../../components/crimePost'
import CrimeExplorerDialog from '../../components/CrimeExplorerDialog'

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const CrimeExplorer = () => {
  const [crimes, setCrimes] = useState([
    {
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'California',
      dateTime: new Date('2023-05-15T14:30:00'),
      description: 'Suspicious activity observed near the local park.'
    },
    {
      address: '456 Elm St',
      city: 'Los Angeles',
      state: 'California',
      dateTime: new Date('2023-05-14T10:15:00'),
      description: 'Reported noise disturbance in residential area.'
    },
    {
      address: '789 Oak Ave',
      city: 'Los Angeles',
      state: 'California',
      dateTime: new Date('2023-05-13T20:45:00'),
      description: 'Vandalism reported at local business.'
    }
  ]) // Initialized with dummy crime data
  const [open, setOpen] = useState(false)

  const handleNewCrimeReport = (newCrime) => {
    setCrimes([newCrime, ...crimes])
    setOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Crime Explorer
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(true)}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
              >
                Report a Crime
              </Button>
            </Box>

            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
              Recent Crime Reports
            </Typography>

            {crimes.length > 0 ? (
              crimes.map((crime, index) => (
                <Box key={index} elevation={2} sx={{ p: 3, mb: 3, borderRadius: '8px' }}>
                  <CrimePost crime={crime} />
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No crime reports yet. Be the first to report!
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>

      <CrimeExplorerDialog open={open} onClose={() => setOpen(false)} onSubmit={handleNewCrimeReport} />
    </ThemeProvider>
  )
}

export default CrimeExplorer
