import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Button, Card, CardContent, CardHeader, Typography, Snackbar } from '@mui/material';
import Layout from './tabs'; // Import the Layout component
interface Ad {
  id: string;
  title: string;
  description: string;
  created_at: string;
  min: number;
  max: number;
  date: string; // Should be in "YYYY-MM-DD" format
  time: string;
  verified: boolean;
  available: boolean;
  info: string;
}

const Main: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('https://teamadmin-73zh.onrender.com/ads');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setAds(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []); // No dependencies, runs once
  
  const filteredAndSortedAds = ads
    .filter((ad) => {
      const today = new Date();
      const adDate = new Date(ad.date);
      return adDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  const currentAd = filteredAndSortedAds[currentIndex];

  const showNextAd = () => {
    if (currentIndex < filteredAndSortedAds.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const showPreviousAd = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const verifyAd = async (id: string) => {
    try {
      const response = await fetch(`https://teamadmin-73zh.onrender.com/ads/${id}/verify`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to verify ad');
      }
      setAds(ads.map((ad) => (ad.id === id ? { ...ad, verified: true } : ad)));
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
    window.location.reload();
  };

  const rejectAd = async (id: string) => {
    try {
      const response = await fetch(`https://teamadmin-73zh.onrender.com/ads/${id}/reject`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to reject ad');
      }
      setAds(ads.map((ad) => (ad.id === id ? { ...ad, verified: false } : ad)));
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
    window.location.reload();
  };

  return (
    <Layout>
    <Box sx={{ padding: 2 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      {/* Loading Spinner */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            Loading ads...
          </Typography>
        </Box>
      ) : error ? (
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          message={error}
          onClose={() => setError(null)}
        />
      ) : filteredAndSortedAds.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No upcoming Events available.
        </Typography>
      ) : (
        <>
          <Card sx={{ marginBottom: 2 }}>
            <CardHeader title={currentAd.title} />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                <strong>Description:</strong> {currentAd.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Min:</strong> {currentAd.min}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Max:</strong> {currentAd.max}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {currentAd.date}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Time:</strong> {currentAd.time}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Verified:</strong> {currentAd.verified ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Available:</strong> {currentAd.available ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Info:</strong> {currentAd.info}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Created at: {new Date(currentAd.created_at).toLocaleString()}
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <Button variant="contained" color="success" onClick={() => verifyAd(currentAd.id)} sx={{ marginRight: 1 }}>
                  Verify
                </Button>
                <Button variant="contained" color="error" onClick={() => rejectAd(currentAd.id)}>
                  Reject
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={showPreviousAd} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={showNextAd}
              disabled={currentIndex === filteredAndSortedAds.length - 1}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
    </Layout>
  );
};

export default Main;
