import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment, Typography, Container, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const AddRace = () => {
  const [raceName, setRaceName] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [raceLocation, setRaceLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [raceNameError, setRaceNameError] = useState('');
  const [seasonYearError, setSeasonYearError] = useState('');
  const [raceDateError, setRaceDateError] = useState('');
  const [raceLocationError, setRaceLocationError] = useState('');
  const [imageFileError, setImageFileError] = useState('');
  const [seasonYears, setSeasonYears] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSeasonYears();
  }, []);

  const fetchSeasonYears = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/Season/GetSeasons`);
      if (response.ok) {
        const seasons = await response.json();
        const years = seasons.map(season => season.year);
        setSeasonYears(years);
      } else {
        toast.error('Failed to fetch season years');
      }
    } catch (error) {
      console.error('Failed to fetch season years:', error);
      toast.error('Failed to fetch season years');
    }
  };

  const validateRaceName = (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue || trimmedValue.length < 3 || /\d/.test(trimmedValue)) {
      setRaceNameError('Please enter a valid race name with at least 3 characters and no digits');
      return false;
    } else {
      setRaceNameError('');
      return true;
    }
  };

  const validateRaceDate = (value) => {
    const minYear = 1600;
    const maxYear = 2050;

    if (!value || new Date(value).getFullYear() < minYear || new Date(value).getFullYear() > maxYear) {
      setRaceDateError(`Please enter a valid race date between ${minYear} and ${maxYear}`);
      return false;
    }
    // check if the year value does not match with the selected season year
    if (new Date(value).getFullYear() !== parseInt(seasonYear)) {
      setRaceDateError('Please select a valid date matching the selected season year');
      return false;
    }
    else {
      setRaceDateError('');
      return true;
    }
  };

  const validateRaceLocation = (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue || trimmedValue.length < 3) {
      setRaceLocationError('Please enter a valid race location with at least 3 characters');
      return false;
    } else {
      setRaceLocationError('');
      return true;
    }
  };

  const validateSeasonYear = (value) => {
    if (!value) {
      setSeasonYearError('Please select a season year');
      return false;
    } else {
      setSeasonYearError('');
      return true;
    }
  };


  const validateImage = (file) => {
    if (!file || !file.type.match(/image\/(jpeg|jpg|png)/)) {
      setImageFileError('Only JPEG or PNG files are allowed');
      return false;
    } else {
      setImageFileError('');
      return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateRaceName(raceName);
    isValid = isValid && validateRaceDate(raceDate);
    isValid = isValid && validateRaceLocation(raceLocation);
    isValid = isValid && validateImage(imageFile);

    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('raceName', raceName);
        formData.append('seasonYear', seasonYear);
        formData.append('raceDate', raceDate);
        formData.append('raceLocation', raceLocation);
        formData.append('imageFile', imageFile);


        console.log('raceName:', raceName);
        console.log('seasonYear:', seasonYear);
        console.log('raceDate:', raceDate);
        console.log('raceLocation:', raceLocation);

        const createRaceResponse = await fetch(`${BASE_URL}/api/Race/CreateRace`, {
          method: 'POST',
          body: formData,
        });

        if (createRaceResponse.status === 201) {
          toast.success('Race added successfully');
          navigate('/RaceListAdmin');
        } else {
          const errorData = await createRaceResponse.json();
          console.error('Race creation failed:', errorData);
          toast.error('Race creation failed');
        }
      } catch (error) {
        console.error('Race creation failed:', error);
        toast.error('Race creation failed! Please check the input data.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all required fields and correct validation errors.');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
        <br />
      <Container maxWidth="sm">
        <Typography variant="h5">Add Race</Typography>
        <form>
          <TextField
            style={{ marginBottom: '10px' }}
            label="Race Name"
            variant="outlined"
            fullWidth
            value={raceName}
            onChange={(e) => {
              setRaceName(e.target.value);
              validateRaceName(e.target.value);
            }}
            error={Boolean(raceNameError)}
            helperText={raceNameError}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="season-year-label">Season Year</InputLabel>
            <Select
              style={{ marginBottom: '10px' }}
              labelId="season-year-label"
                value={seasonYear}
                onChange={(e) => {
                  setSeasonYear(e.target.value);
                  validateSeasonYear(e.target.value);
                }}
              error={Boolean(seasonYearError)}
              label="Season Year"
            >
              {seasonYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {seasonYearError && (
              <Typography variant="caption" color="error">
                {seasonYearError}
              </Typography>
            )}
          </FormControl>
          <TextField
            style={{ marginBottom: '10px' }}
            label="Race Date"
            type="date"
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={raceDate}
            onChange={(e) => {
              setRaceDate(e.target.value);
              validateRaceDate(e.target.value);
            }}
            error={Boolean(raceDateError)}
            helperText={raceDateError}
          />
          <TextField
            label="Race Location"
            variant="outlined"
            fullWidth
            value={raceLocation}
            onChange={(e) => {
              setRaceLocation(e.target.value);
              validateRaceLocation(e.target.value);
            }}
            error={Boolean(raceLocationError)}
            helperText={raceLocationError}
          />
          <input
            accept="image/jpeg, image/jpg, image/png"
            style={{ display: 'none' }}
            id="image-file-input-race"
            type="file"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              validateImage(e.target.files[0]);
            }}
          />
          <label htmlFor="image-file-input-race">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              style={{ marginTop: '10px' }}
              startIcon={<InputAdornment position="start">📷</InputAdornment>}
            >
              Upload Image
            </Button>
          </label>
          {imageFileError && (
            <Typography variant="caption" color="error">
              {imageFileError}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '10px', marginBottom: '20px' }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Race'}
          </Button>
        </form>
      </Container>
      <Footer />
    </div>
  );
};

export default AddRace;
