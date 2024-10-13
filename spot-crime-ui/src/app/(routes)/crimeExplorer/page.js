"use client"

import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Paper, Button, ThemeProvider, createTheme, Autocomplete, TextField } from '@mui/material'
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
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [address, setAddress] = useState(null)

  const fetchCrimes = async (placeId=null) => {
    try {
      let url = 'http://localhost:5000/api/crimes'
      if(placeId) {
        url += `?placeId=${placeId}`
      }
      await axios.get(url).then(res => {
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
      await axios.put(`http://localhost:5000/api/crimes/${reportId}`);
      await fetchCrimes();
    } catch (error) {
      console.error('Error upvoting crime:', error);
    }
  }

  const getAddressSuggestions = async (input) => {
    try {
      if (input.length > 2) {
        const response = await axios.get(`http://localhost:5000/api/autocomplete?input=${encodeURIComponent(input)}`);
        const suggestions = response.data.predictions.map(prediction => ({
          description: prediction.description,
          placeId: prediction.placeId
        }));
        setAddressSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  }

  const handleAddressChange = (event, newValue) => {
    fetchCrimes(newValue.placeId);
  }

  const handleAddressInputChange = (event, newInputValue) => {
    if (newInputValue.length > 2) {
      getAddressSuggestions(newInputValue);
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
            <Autocomplete
              fullWidth
              options={addressSuggestions}
              getOptionLabel={(option) => option.description || ""}
              value={address}
              onChange={handleAddressChange}
              onInputChange={handleAddressInputChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Address"
                  required
                  placeholder="Enter an address"
                  sx={{ '& .MuiInputBase-input': { width: '100%' }, 'marginBottom': '50px' }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
            />
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
