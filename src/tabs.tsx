import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Person } from '@mui/icons-material';  // Material-UI icons
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Define the type for the props, including `children`
interface LayoutProps {
  children: React.ReactNode;  // This defines the 'children' prop correctly
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();  // Use location hook to track the current route

  // Map current route to BottomNavigation value
  const getTabIndex = (path: string) => {
    switch (path) {
      case '/users':
        return 1; // Users tab selected
      case '/':
      default:
        return 0; // Ads tab selected (default case)
    }
  };

  // Handle BottomNavigation value change
  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate('/');  // Redirect to Ads page
    } else if (newValue === 1) {
      navigate('/users');  // Redirect to Users page
    }
  };

  return (
    <Box>
      {/* Main Content */}
      <Box mb="60px">
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bgcolor="white"
        borderTop="1px solid #e2e8f0"
        zIndex={10}
        boxShadow="0 -1px 5px rgba(0, 0, 0, 0.1)"
      >
        <BottomNavigation
          value={getTabIndex(location.pathname)}  // Get the current tab based on location.pathname
          onChange={handleBottomNavChange}
          showLabels
          sx={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
            left: 0,
            backgroundColor: '#ffffff',
            boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <BottomNavigationAction
            label='events'
            icon={<Home />}
            component={Link}
            to="/"
          />
          <BottomNavigationAction
            label='users'
            icon={<Person />}
            component={Link}
            to="/users"
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Layout;
