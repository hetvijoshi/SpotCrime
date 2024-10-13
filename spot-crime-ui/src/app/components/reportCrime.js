import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Grid, Autocomplete } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import axios from 'axios'

const ReportCrime = ({ onSubmit, onClose }) => {
  const [address, setAddress] = useState('')
  const [city] = useState('Los Angeles')
  const [state] = useState('California')
  const [dateTime, setDateTime] = useState(dayjs())
  const [description, setDescription] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState([])

  const getAddressSuggestions = async (input) => {
    console.log(input);
    const location = "34.0522,-118.2437"; // Coordinates for Los Angeles
    const radius = 50000; // 50km radius
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&location=${location}&radius=${radius}&key=AIzaSyCGCejPxj93O5lcGEezTVJ7QhO6YvC-oMw`;
    try {
      const response = await axios.get(url);
      console.log(response.data)
      const suggestions = response.data.predictions.map(prediction => prediction.description);
      setAddressSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  }

  const handleAddressChange = (event, newValue) => {
    console.log(newValue);
    setAddress(newValue);
  }

  const handleAddressInputChange = (event, newInputValue) => {
    console.log(newInputValue);
    setAddress(newInputValue);
    if (newInputValue.length > 2) {
      getAddressSuggestions(newInputValue);
    }
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    const newCrime = {
      address,
      city,
      state,
      dateTime: dateTime.toDate(),
      description,
    }
    onSubmit(newCrime)
    // Reset form fields
    setAddress('')
    setDateTime(dayjs())
    setDescription('')
    onClose()
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
      <Grid container spacing={2} marginTop={0.5}>
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            freeSolo
            options={addressSuggestions}
            value={address}
            onChange={handleAddressChange}
            onInputChange={handleAddressInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Address"
                required
                sx={{ '& .MuiInputBase-input': { width: '100%' } }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="City"
            value={city}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="State"
            value={state}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date and Time"
              value={dateTime}
              onChange={(newValue) => setDateTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth InputLabelProps={{ shrink: true }} />}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
            Submit Report
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReportCrime
