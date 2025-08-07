import React from "react";
import { CircularProgress, Box, Typography, useTheme } from "@mui/material";
import { DirectionsBus } from "@mui/icons-material";

const Loader = () => {
  const theme = useTheme();
  
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight="50vh"
      sx={{
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
      }}
    >
      <DirectionsBus 
        sx={{ 
          fontSize: 48, 
          color: theme.palette.primary.main,
          mb: 2,
          animation: 'bounce 1s infinite',
          '@keyframes bounce': {
            '0%, 100%': {
              transform: 'translateY(0)',
            },
            '50%': {
              transform: 'translateY(-10px)',
            },
          },
        }} 
      />
      <CircularProgress 
        size={40}
        thickness={4}
        sx={{ mb: 2 }}
      />
      <Typography 
        variant="h6" 
        color="primary"
        sx={{ 
          fontWeight: 500,
          opacity: 0.9
        }}
      >
        Searching for buses...
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        Please wait while we find the best options for you
      </Typography>
    </Box>
  );
};

export default Loader;
