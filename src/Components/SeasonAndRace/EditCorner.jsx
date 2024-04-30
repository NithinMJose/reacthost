import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Paper, Typography } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import axios from 'axios';
import { BASE_URL } from '../../config';

const EditCorner = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [corner, setCorner] = useState({
    cornerId: null,
    cornerNumber: 0,
    cornerCapacity: 0,
  });

  useEffect(() => {
    const fetchCornerById = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Corner/GetCornerById?id=${state.cornerId}`);
        setCorner(response.data);
      } catch (error) {
        console.error('Error fetching corner:', error);
      }
    };

    fetchCornerById();
  }, [state.cornerId]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/Corner/UpdateCorner`, {
        cornerId: corner.cornerId,
        cornerNumber: corner.cornerNumber,
        cornerCapacity: corner.cornerCapacity,
      });

      if (response.status === 200) {
        console.log('Corner updated successfully!');
        navigate('/CornerListAdmin');
      } else {
        console.error('Error updating corner:', response.status);
      }
    } catch (error) {
      console.error('Error updating corner:', error);
    }
  };

  return (
    <>
      <AdminNavbar />

      <Container maxWidth="md" style={{ marginTop: '120px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Edit Corner
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Corner Number"
                fullWidth
                value={corner.cornerNumber}
                onChange={(e) => setCorner({ ...corner, cornerNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Corner Capacity"
                fullWidth
                value={corner.cornerCapacity}
                onChange={(e) => setCorner({ ...corner, cornerCapacity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Corner
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <br />
      <Footer />
    </>
  );
};

export default EditCorner;
