"use client"

import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Paper, Button, ThemeProvider, createTheme } from '@mui/material'
import CrimePost from '../../components/crimePost'
import CrimeExplorerDialog from '../../components/CrimeExplorerDialog'
import axios from 'axios'

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
  const [crimes, setCrimes] = useState([])
  const [open, setOpen] = useState(false)

  const fetchCrimes = async () => {
    try {
      await axios.get('http://localhost:3001/api/crimes').then(res => {
        setCrimes(res.data)
      })
    } catch (error) {
      console.error('Error fetching crimes:', error)
    }
  }

  useEffect(() => {
    fetchCrimes()
  }, [])

  const handleNewCrimeReport = async (newCrime) => {
    try {
      fetchCrimes()
      setOpen(false)
    } catch (error) {
      console.error('Error submitting new crime:', error)
    }
  }

  const handleUpvote = async (reportId) => {
    try {
      await axios.put(`http://localhost:3001/api/crimes/${reportId}`);
      await fetchCrimes();
    } catch (error) {
      console.error('Error upvoting crime:', error);
    }
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
                  <CrimePost crime={crime} handleUpvote={handleUpvote} />
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
