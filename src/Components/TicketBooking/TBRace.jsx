import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../LoginSignup/Footer';
import { TextField, InputAdornment, Grid, Card, CardContent, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UserNavbar from '../LoginSignup/UserNavbar';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';
import { BASE_URL } from '../../config';

const TBRace = () => {
  const navigate = useNavigate();
  const { uniqueSeasonName } = useParams();
  const [races, setRaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchRacesBySeason = async () => {
      try {
        const seasonResponse = await axios.get(`${BASE_URL}/api/Season/GetSeasonIdFromSeasonUniqueName?uniqueSeasonName=${uniqueSeasonName}`);
        const seasonId = seasonResponse.data;
        console.log('Fetched Season ID:', seasonId);
        
        const racesResponse = await axios.get(`${BASE_URL}/api/Race/GetRaceBySeason?seasonId=${seasonId}`);
        const fetchedRaces = racesResponse.data;
        console.log('Fetched Race Data:', fetchedRaces);
        setRaces(fetchedRaces);
      } catch (error) {
        console.error('Error fetching races:', error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is done
      }
    };

    fetchRacesBySeason();
  }, [uniqueSeasonName]);

  const handleRaceClick = (uniqueRaceName) => {
    navigate(`/TBCorner/${uniqueRaceName}`, { replace: true }); // Append uniqueRaceName to URL
  };

  const filteredRaces = races.filter(
    (race) =>
      (race.raceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.raceLocation.toLowerCase().includes(searchTerm.toLowerCase())) &&
      new Date(race.raceDate) > new Date() // Filter out races with past dates
  );

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>
          <UserNavbar />
          <br />
          <br />
          <br />
          <br />
          <p>We are loading race data. Hang On!</p>
          <BeatLoader color={'#123abc'} loading={loading} css={override} size={30} /> {/* Adjust size here */}
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <h1>Select Your Race For the Season</h1>

      {/* Search Bar */}
      <TextField
        label="Search Race"
        variant="outlined"
        size="small"
        sx={{ mb: 2, width: '20%' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Display Races in a Responsive Grid */}
      {filteredRaces.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 4 }}>
          No races are available to book for the selected season.
        </Typography>
      ) : (
          <Grid container spacing={2} justifyContent="center">
            {filteredRaces.map(race => (
              <Grid item key={race.raceId} xs={12} sm={6} md={3} lg={3} sx={{ margin: '8px' }}>
                <Card onClick={() => handleRaceClick(race.uniqueRaceName)} sx={{ cursor: 'pointer', height: '100%', width: '90%' }}>
                  <img
                    src={race.imagePath}
                    alt={`Race ${race.raceName} Image`}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6">{`Race - ${race.raceName}`}</Typography>
                    <Typography>{`Date: ${new Date(race.raceDate).toLocaleDateString()}`}</Typography>
                    <Typography>{`Location: ${race.raceLocation}`}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
      )}

      <Footer />
    </div>
  );
};


export default TBRace;