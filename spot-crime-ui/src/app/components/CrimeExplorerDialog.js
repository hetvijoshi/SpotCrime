import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import ReportCrime from './reportCrime';
import CrimePost from './crimePost';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const CrimeExplorerDialog = ({ open, onClose, onSubmit }) => {
  const [crimes, setCrimes] = useState([]); // This would be populated from your API
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const handleOpenReportDialog = () => setOpenReportDialog(true);
  const handleCloseReportDialog = () => setOpenReportDialog(false);


  const theme = createTheme({
    palette: {
      background: {
        default: '#f5f5f5',
      },
    },
  });

  const handleSubmitReport = (newCrime) => {
    onSubmit();
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose}>
      <DialogTitle>Report a Crime</DialogTitle>
      <DialogContent>
        <ReportCrime open={openReportDialog}
        onClose={onClose}
        onSubmit={handleSubmitReport} />
      </DialogContent>
    </Dialog>
    </ThemeProvider>
  );
};

export default CrimeExplorerDialog;
