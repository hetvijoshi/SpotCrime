import React, { useState } from 'react'
import { Card, CardContent, Typography, CardMedia, IconButton, Box } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import dayjs from 'dayjs'
const CrimePost = ({ crime , handleUpvote}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {crime.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         {crime.crm_cd_desc} | {dayjs(crime.date_occ).format('MM/DD/YYYY')} | {dayjs(`2000-01-01 ${crime.time_occ.slice(0, 2)}:${crime.time_occ.slice(2)}`).format('h:mm A')}
        </Typography>
        <Typography variant="body1" paragraph>
          {crime.description}
        </Typography>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleUpvote(crime.reportid)} color="primary">
            <ThumbUpIcon />
          </IconButton>
          <Typography variant="body2">{crime.vote}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrimePost
