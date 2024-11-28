import React, { useState, useEffect } from 'react';
import { Box, Card, CardHeader, CardContent, Button, CircularProgress, Typography, Snackbar } from '@mui/material';
import Layout from './tabs'; // Import the Layout component

const UsersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://teamadmin-73zh.onrender.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const currentUser = users[currentUserIndex];

  const showNextUser = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(prevIndex => prevIndex + 1);
    }
  };

  const showPreviousUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(prevIndex => prevIndex - 1);
    }
  };

  const verifyUser = async (id: string) => {
    try {
      const response = await fetch(`https://teamadmin-73zh.onrender.com/users/${id}/verify`, { // Fixed URL
        method: 'PUT',
      });
  
      if (!response.ok) {
        throw new Error('Failed to verify user');
      }
  
      const updatedUser = await response.json();
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.user.id ? { ...user, verified: true } : user
        )
      );
  
      setError('User verified successfully');
      window.location.reload();

    } catch (error: any) {
      setError(error.message || 'An error occurred while verifying the user');
    }
  };

  const rejectUser = async (id: string) => {
    try {
      const response = await fetch(`https://teamadmin-73zh.onrender.com/users/${id}/reject`, { // Fixed URL
        method: 'PUT',
      });
  
      if (!response.ok) {
        throw new Error('Failed to reject user');
      }
  
      const updatedUser = await response.json();
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.user.id ? { ...user, verified: false } : user
        )
      );
  
      setError('User rejected successfully');
      window.location.reload();

    } catch (error: any) {
      setError(error.message || 'An error occurred while rejecting the user');
    }
  };
  
  return (
    <Layout>
      <Box sx={{ padding: 2, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError(null)} message={error} />
        ) : users.length === 0 ? (
          <Typography>No users available.</Typography>
        ) : (
          <>
            <Card key={currentUser.id}>
              <CardHeader title={`${currentUser.first_name} ${currentUser.last_name}`} />
              <CardContent>
                {currentUser.image_url && (
                  <img
                    src={currentUser.image_url}
                    alt={`${currentUser.first_name} ${currentUser.last_name}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' }}
                  />
                )}
                <Typography><strong>Email:</strong> {currentUser.email}</Typography>
                <Typography><strong>Phone:</strong> {currentUser.phone}</Typography>
                <Typography><strong>Instagram:</strong> {currentUser.instagram_account}</Typography>
                <Typography><strong>University:</strong> {currentUser.university}</Typography>
                <Typography><strong>Gender:</strong> {currentUser.gender}</Typography>
                <Typography><strong>Verified:</strong> {currentUser.verified ? 'Yes' : 'No'}</Typography>
                <Button variant="contained" color="success" onClick={() => verifyUser(currentUser.id)} sx={{ marginRight: 1 }}>
                  Verify
                </Button>
                <Button variant="contained" color="error" onClick={() => rejectUser(currentUser.id)}>
                  Reject
                </Button>
              </CardContent>
            </Card>

            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" onClick={showPreviousUser} disabled={currentUserIndex === 0}>
                Previous
              </Button>
              <Button variant="contained" onClick={showNextUser} disabled={currentUserIndex === users.length - 1}>
                Next
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default UsersPage;
