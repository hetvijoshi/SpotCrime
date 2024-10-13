import React from 'react'
import { Card, CardContent, Typography, CardMedia } from '@mui/material'

const CrimePost = ({ crime }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {crime.address}, {crime.city}, {crime.state}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(crime.dateTime).toLocaleString()}
        </Typography>
        <Typography variant="body1" paragraph>
          {crime.description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CrimePost
