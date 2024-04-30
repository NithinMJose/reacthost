import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, FormControl, Select, MenuItem } from '@mui/material';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import axios from 'axios';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const RaceListAdmin = () => {
  const navigate = useNavigate();
  const [raceData, setRaceData] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(''); // State to store selected season

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      axios
        .get(`${BASE_URL}/api/Race/GetAllRaces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRaceData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching race data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            navigate('/');
          } else {
            toast.error('An error occurred while fetching race data');
          }
        });

      // Fetch season data
      axios
        .get('https://localhost:7092/api/Season/GetSeasons')
        .then((response) => {
          console.log('Season data:', response.data);
          setSeasonData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching season data:', error);
          toast.error('An error occurred while fetching season data');
        });
    } catch (error) {
      console.error('An error occurred while decoding the token:', error);
      toast.error('An error occurred while decoding the token');
      navigate('/Home');
    }
  }, [navigate]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
    console.log('Selected season:', event.target.value);
  };

  const renderRaceData = () => {
    if (!raceData || !seasonData) {
      return <p>Loading race data...</p>;
    }

    // Filter race data based on the selected year
    const filteredRaceData = selectedSeason
      ? raceData.filter((race) => race.seasonYear === selectedSeason)
      : raceData;

    // Sort seasonData by year
    const sortedSeasonData = seasonData.slice().sort((a, b) => a.year - b.year);

    return (
      <div>
        <FormControl style={{ display: 'inline-block', marginRight: '10px', marginTop: '30px' }}>
          <p style={{ display: 'inline-block', fontSize: '30px' }}>Select the year</p>
          <Select
            value={selectedSeason}
            onChange={handleSeasonChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select the year' }}
            style={{ minWidth: '120px', marginLeft: '20px' }}
          >
            <MenuItem value="" disabled>
              Choose a year
            </MenuItem>
            {sortedSeasonData.map((season) => (
              <MenuItem key={season.seasonId} value={season.year}>
                {season.year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '5%' }}>Race ID</TableCell>
                <TableCell style={{ width: '15%' }}>Race Name</TableCell>
                <TableCell style={{ width: '15%' }}>Season</TableCell>
                <TableCell style={{ width: '15%' }}>Race Date</TableCell>
                <TableCell style={{ width: '20%' }}>Race Location</TableCell>
                <TableCell style={{ width: '20%' }}>Image</TableCell>
                <TableCell style={{ width: '10%' }}>Manage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRaceData.map((race) => (
                <TableRow key={race.raceId}>
                  <TableCell>{race.raceId}</TableCell>
                  <TableCell>{race.raceName}</TableCell>
                  <TableCell>{race.seasonYear}</TableCell>
                  <TableCell>{new Date(race.raceDate).toLocaleString()}</TableCell>
                  <TableCell>{race.raceLocation}</TableCell>
                  <TableCell>
                    {race.imagePath && (
                      <img
                        src={race.imagePath}
                        alt={`Race ${race.raceName}`}
                        style={{ maxWidth: '100%', maxHeight: '100px' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleManageRace(race.raceId)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };



  const handleManageRace = (raceId) => {
    navigate(`/EditRace`, { replace: true, state: { raceId } });
  };

  return (
    <div className="racelistadmin">
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
      {renderRaceData()}
      <br />
      <Footer />
    </div>
  );
};

export default RaceListAdmin;