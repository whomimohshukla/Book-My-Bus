// components/Emergency/SOSAlert.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import { Check, Warning } from '@mui/icons-material';

const SOSAlert = ({ open, onClose, alertData, loading, error }) => {
    const [showDetails, setShowDetails] = useState(false);

    const renderAlertStatus = () => {
        if (loading) {
            return (
                <Box display="flex" alignItems="center" justifyContent="center" p={3}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>
                        Sending emergency alert...
                    </Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            );
        }

        if (alertData) {
            return (
                <Alert 
                    icon={<Check fontSize="inherit" />} 
                    severity="success"
                    sx={{ mt: 2 }}
                >
                    Emergency alert sent successfully!
                </Alert>
            );
        }

        return null;
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ 
                bgcolor: 'error.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Warning sx={{ mr: 1 }} />
                Emergency Alert Status
            </DialogTitle>
            
            <DialogContent>
                {renderAlertStatus()}
                
                {alertData && (
                    <Box mt={2}>
                        <Typography variant="body1" gutterBottom>
                            Alert ID: {alertData.id}
                        </Typography>
                        
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowDetails(!showDetails)}
                            sx={{ mt: 1 }}
                        >
                            {showDetails ? 'Hide' : 'Show'} Details
                        </Button>
                        
                        {showDetails && (
                            <Box mt={2}>
                                <Typography variant="body2" gutterBottom>
                                    Location: {alertData.location.latitude}, {alertData.location.longitude}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Time: {new Date(alertData.timestamp).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Type: {alertData.emergencyType}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Description: {alertData.description}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                {alertData && (
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                            // Handle viewing full details or generating report
                            console.log('View full details');
                        }}
                    >
                        View Full Report
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SOSAlert;