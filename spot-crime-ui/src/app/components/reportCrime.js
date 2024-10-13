import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Grid, Autocomplete, MenuItem } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import axios from 'axios'

const ReportCrime = ({ onSubmit, onClose }) => {
    const [address, setAddress] = useState(null)
    const [city] = useState('Los Angeles')
    const [state] = useState('California')
    const [dateTime, setDateTime] = useState(dayjs())
    const [description, setDescription] = useState('')
    const [addressSuggestions, setAddressSuggestions] = useState([])
    const [crimeType, setCrimeType] = useState('')
    const [crimeCategories, setCrimeCategories] = useState([])

    useEffect(() => {
        const fetchCrimeCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/crimecategory');
                setCrimeCategories(response.data.map(category => category.crm_cd_desc));
            } catch (error) {
                console.error('Error fetching crime categories:', error);
            }
        };
        fetchCrimeCategories();
    }, []);

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
        setAddress(newValue);
    }

    const handleAddressInputChange = (event, newInputValue) => {
        if (newInputValue.length > 2) {
            getAddressSuggestions(newInputValue);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const newCrime = {
            placeId: address ? address.placeId : '',
            crimeCategory: crimeType,
            description,
            crimeDate: dateTime.format('YYYY-MM-DD'),
            crimeTime: dateTime.format('HHmm')
        }
        try {
            const response = await axios.post('http://localhost:5000/api/crimes', newCrime);
            onSubmit(newCrime)
            // Reset form fields
            setAddress(null)
            setDateTime(dayjs())
            setDescription('')
            setCrimeType('')
            onClose()
        } catch (error) {
            console.error('Error submitting crime report:', error);
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Grid container spacing={2} marginTop={0.5}>
                <Grid item xs={12}>
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
                                sx={{ '& .MuiInputBase-input': { width: '100%' } }}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
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
                        select
                        fullWidth
                        label="Type of Crime"
                        value={crimeType}
                        onChange={(e) => setCrimeType(e.target.value)}
                        required
                    >
                        {crimeCategories.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
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
