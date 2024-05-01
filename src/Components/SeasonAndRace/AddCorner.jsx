import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const AddCorner = () => {
  const [cornerNumber, setCornerNumber] = useState('');
  const [cornerCapacity, setCornerCapacity] = useState('');
  const [seasonYears, setSeasonYears] = useState([]);
  const [selectedSeasonYear, setSelectedSeasonYear] = useState('');
  const [raceNames, setRaceNames] = useState([]);
  const [selectedRaceName, setSelectedRaceName] = useState(''); // Add state for selected race name
  const [loading, setLoading] = useState(false);

  const [cornerNumberError, setCornerNumberError] = useState('');
  const [cornerCapacityError, setCornerCapacityError] = useState('');
  const [raceIdError, setRaceIdError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    console.log('New Year is selected:', selectedSeasonYear);
    if (selectedSeasonYear) {
      fetchRacesBySeasonYear(selectedSeasonYear);
    }
  }, [selectedSeasonYear]);

  const fetchSeasons = async () => {
    console.log('fetching seasons');
    try {
      const response = await fetch(`${BASE_URL}/api/Season/GetSeasons`);
      if (response.ok) {
        const data = await response.json();
        const years = data.map(season => season.year);
        console.log('season years:', years);
        setSeasonYears(years);
        if (years.length > 0) {
          setSelectedSeasonYear(years[0]);
        }
      } else {
        throw new Error('Failed to fetch seasons');
      }
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  };

  const fetchRacesBySeasonYear = async (year) => {
    console.log('fetching races by season year:', year);
    try {
      const response = await fetch(`${BASE_URL}/api/Race/GetRacesBySeasonYear?year=${year}`);
      if (response.ok) {
        if (response.headers.get('content-type').includes('application/json')) {
          const data = await response.json();
          if (data.length > 0) {
            const names = data.map(race => race.raceName);
            console.log("Available Race names are:", names);
            setRaceNames(names);
          } else {
            console.log("No races found for the selected year.");
            setRaceNames([]); // Clear raceNames state if no races found
          }
        } else {
          console.log("No races found for the selected year.");
          setRaceNames([]); // Clear raceNames state if no races found
        }
      } else {
        throw new Error('Failed to fetch races by season year');
      }
    } catch (error) {
      console.error('Error fetching races by season year:', error);
    }
  };



  const validateCornerNumber = (value) => {
    if (!/^\d+$/.test(value)) {
      setCornerNumberError('Only digits are allowed');
      return false;
    } else if (value <= 0) {
      setCornerNumberError('Please enter a valid corner number greater than 0');
      return false;
    } else {
      setCornerNumberError('');
      return true;
    }
  };

  const validateCornerCapacity = (value) => {
    const MIN_CAPACITY = 50;
    const MAX_CAPACITY = 500;

    if (!/^\d+$/.test(value)) {
      setCornerCapacityError('Only digits are allowed');
      return false;
    } else if (value < MIN_CAPACITY || value > MAX_CAPACITY) {
      setCornerCapacityError(`Please enter a valid corner capacity between ${MIN_CAPACITY} and ${MAX_CAPACITY}`);
      return false;
    } else {
      setCornerCapacityError('');
      return true;
    }
  };

  const validateRaceId = (value) => {
    if (!/^\d+$/.test(value)) {
      setRaceIdError('Only digits are allowed');
      return false;
    } else if (value <= 0) {
      setRaceIdError('Please enter a valid race ID greater than 0');
      return false;
    } else {
      setRaceIdError('');
      return true;
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const requestBody = {
          cornerNumber: parseInt(cornerNumber),
          cornerCapacity: parseInt(cornerCapacity),
          seasonYear: selectedSeasonYear, // Use selectedSeasonYear instead of raceId
          raceName: selectedRaceName, // Use selectedRaceName instead of raceId
        };

        const createCornerResponse = await fetch(`${BASE_URL}/api/Corner/InsertCorner`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (createCornerResponse.status === 201) {
          toast.success('Corner added successfully');
          navigate('/CornerListAdmin'); // Adjust the route as needed
        } else if (createCornerResponse.status === 409) {
          toast.error('Corner Number is already entered for the given race');
          console.log('Corner creation failed: Corner Number is already entered for');
        } else {
          const errorData = await createCornerResponse.json();
          console.error('Corner creation failed:', errorData);
          toast.error('Corner creation failed');
        }
      } catch (error) {
        console.error('Corner creation failed:', error);
        toast.error('Corner creation failed');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all required fields and correct validation errors.');
    }
  };


  const validateForm = () => {
    let isValid = true;

    isValid = isValid && validateCornerNumber(cornerNumber);
    isValid = isValid && validateCornerCapacity(cornerCapacity);

    return isValid;
  };


  return (
    <div>
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Container maxWidth="sm" className="outerSetup">
        <div className="add-corner-container">
          <div className="add-corner-panel">
            <Typography variant="h5" className="add-corner-header">
              Add Corner
            </Typography>
            <div className="add-corner-inputsadmin">
              <TextField
                label="Corner Number"
                variant="outlined"
                fullWidth
                type="number"
                value={cornerNumber}
                onChange={(e) => {
                  setCornerNumber(e.target.value);
                  validateCornerNumber(e.target.value);
                }}
                onBlur={() => validateCornerNumber(cornerNumber)}
                error={Boolean(cornerNumberError)}
                helperText={cornerNumberError}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Corner Capacity"
                variant="outlined"
                fullWidth
                type="number"
                value={cornerCapacity}
                onChange={(e) => {
                  setCornerCapacity(e.target.value);
                  validateCornerCapacity(e.target.value);
                }}
                onBlur={() => validateCornerCapacity(cornerCapacity)}
                error={Boolean(cornerCapacityError)}
                helperText={cornerCapacityError}
                style={{ marginBottom: '10px' }}
              />
              <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
                <InputLabel id="season-year-label">Select Season Year</InputLabel>
                <Select
                  labelId="season-year-label"
                  id="season-year-select"
                  value={selectedSeasonYear}
                  onChange={(e) => setSelectedSeasonYear(e.target.value)}
                  label="Select Season Year"
                >
                  {seasonYears.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
                <InputLabel id="race-name-label">Select Race Name</InputLabel>
                <Select
                  labelId="race-name-label"
                  id="race-name-select"
                  value={selectedRaceName} // Use selectedRaceName instead of raceId
                  onChange={(e) => setSelectedRaceName(e.target.value)} // Use setSelectedRaceName instead of setRaceId
                  label="Select Race Name"
                >
                  {raceNames.map((name, index) => (
                    <MenuItem key={index} value={name}>{name}</MenuItem> // Pass name as value instead of index + 1
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="add-corner-submit-container">
              {!raceNames.includes("Hello There") && (
                <Button
                  variant="contained"
                  color="primary"
                  className="add-corner-submit"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Corner'}
                </Button>
              )}
            </div>

          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default AddCorner;