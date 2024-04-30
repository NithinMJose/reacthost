import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Paper, Typography } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { to } from 'react-spring';
import { toast } from 'materialize-css';

const EditRace = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [race, setRace] = useState({
    raceId: null,
    raceName: '',
    seasonYear: '', // Updated to seasonYear
    raceDate: '',
    raceLocation: '',
    imageFile: null,
  });

  const [raceNameError, setRaceNameError] = useState('');
  const [seasonYearError, setSeasonYearError] = useState(''); // Updated to seasonYearError
  const [raceDateError, setRaceDateError] = useState('');
  const [raceLocationError, setRaceLocationError] = useState('');
  const [imageFileError, setImageFileError] = useState('');

  useEffect(() => {
    const fetchRaceById = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Race/GetRaceById?id=${state.raceId}`);
        setRace({
          ...response.data,
          raceDate: new Date(response.data.raceDate).toISOString().split('T')[0],
        });
        console.log('The data is:', response.data);
      } catch (error) {
        console.error('Error fetching race:', error);
      }
    };

    fetchRaceById();
  }, [state.raceId]);

  const handleFileChange = (e) => {
    setRace({ ...race, imageFile: e.target.files[0] });
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'raceName':
        validateRaceName(value);
        break;
      case 'seasonYear':
        validateSeasonYear(value); // Updated to seasonYear
        break;
      case 'raceDate':
        validateRaceDate(value);
        break;
      case 'raceLocation':
        validateRaceLocation(value);
        break;
      default:
        break;
    }
  };

  const validateRaceName = (value) => {
    if (value.trim().length < 3) {
      setRaceNameError('Race Name should be at least 3 characters long');
    } else {
      setRaceNameError('');
    }
  };

  const validateSeasonYear = (value) => {
    if (!isPositiveInteger(value) || value.length !== 4 || value.trim().length === 0 || value < 1700 || value > 2500) {
      setSeasonYearError('Season Year must be a positive integer and 4 digits long and between 1700 and 2500');
    } else {
      setSeasonYearError('');
    }
  };

  function isPositiveInteger(n) {
    return n > 0 && Number.isInteger(Number(n));
  }

  const validateRaceDate = (value) => {
    if (!value) {
      setRaceDateError('Race Date is required');
    }// check if the year value does not match with the selected season year
    if (new Date(value).getFullYear() !== parseInt(race.seasonYear)) {
      setRaceDateError('Please select a valid date matching the selected season year');
    }

    else {
      setRaceDateError('');
    }
  };

  const validateRaceLocation = (value) => {
    if (value.trim().length < 3) {
      setRaceLocationError('Race Location should be at least 3 characters long');
    } else {
      setRaceLocationError('');
    }
  };

  const validateImageFile = (file) => {
    if (!file) {
      setImageFileError('');
    } else {
      const allowedExtensions = ['png', 'jpg'];
      const extension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        setImageFileError('Invalid file format. Please use PNG or JPG.');
      } else {
        setImageFileError('');
      }
    }
  };

  const handleUpdate = async () => {
    // Validate fields
    validateField('raceName', race.raceName);
    validateField('seasonYear', race.seasonYear); 
    validateField('raceDate', race.raceDate);
    validateField('raceLocation', race.raceLocation);
    validateImageFile(race.imageFile);

    // If any validation fails, return without updating
    if (raceNameError || seasonYearError || raceDateError || raceLocationError || imageFileError) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('raceId', race.raceId);
      formData.append('raceName', race.raceName);
      formData.append('seasonYear', race.seasonYear); // Updated to seasonYear
      formData.append('raceDate', race.raceDate);
      formData.append('raceLocation', race.raceLocation);
      formData.append('imageFile', race.imageFile);


      const response = await axios.put(`${BASE_URL}/api/Race/UpdateRace`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Race updated successfully!');
        navigate('/RaceListAdmin');
      } else {
        console.error('Error updating race:', response.status);
      }
    } catch (error) {
      console.error('Error updating race:', error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Edit Race
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Race Name"
                fullWidth
                value={race.raceName}
                onChange={(e) => {
                  setRace({ ...race, raceName: e.target.value });
                  validateRaceName(e.target.value);
                }}
                error={Boolean(raceNameError)}
                helperText={raceNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Season Year"
                fullWidth
                value={race.seasonYear}
                onChange={(e) => {
                  setRace({ ...race, seasonYear: e.target.value });
                  validateSeasonYear(e.target.value);
                }}
                error={Boolean(seasonYearError)}
                helperText={seasonYearError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Race Date"
                fullWidth
                type="date"
                value={race.raceDate}
                onChange={(e) => {
                  setRace({ ...race, raceDate: e.target.value });
                  validateRaceDate(e.target.value);
                }}
                error={Boolean(raceDateError)}
                helperText={raceDateError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Race Location"
                fullWidth
                value={race.raceLocation}
                onChange={(e) => {
                  setRace({ ...race, raceLocation: e.target.value });
                  validateRaceLocation(e.target.value);
                }}
                error={Boolean(raceLocationError)}
                helperText={raceLocationError}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e);
                  validateImageFile(e.target.files[0]);
                }}
              />
              {imageFileError && (
                <Typography variant="body2" color="error">
                  {imageFileError}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update Race
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

export default EditRace;