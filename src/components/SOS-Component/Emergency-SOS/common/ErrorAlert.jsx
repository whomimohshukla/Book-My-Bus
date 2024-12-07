// components/common/ErrorAlert.js
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

const ErrorAlert = ({ title = 'Error', message }) => {
    return (
        <Box sx={{ my: 2 }}>
            <Alert severity="error">
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
        </Box>
    );
};

export default ErrorAlert;