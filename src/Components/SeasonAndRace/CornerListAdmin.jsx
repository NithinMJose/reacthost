import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const CornerListAdmin = () => {
  const navigate = useNavigate();
  const [cornerData, setCornerData] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      toast.error('You have to log in as Admin to access the page');
      navigate('/');
      return;
    }

    try {
      axios
        .get(`${BASE_URL}/api/Corner/GetAllCorners`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCornerData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching corner data:', error);
          if (error.response && error.response.status === 401) {
            toast.error('Unauthorized access. Please log in again.');
            navigate('/');
          } else {
            toast.error('An error occurred while fetching corner data');
          }
        });

      axios
        .get(`${BASE_URL}/api/Season/GetSeasons`)
        .then((response) => {
          console.log('Season data:', response.data);
          const sortedSeasonData = response.data.sort((a, b) => a.year - b.year);
          setSeasonData(sortedSeasonData);
          if (sortedSeasonData && sortedSeasonData.length > 0) {
            setSelectedSeason(sortedSeasonData[0].year.toString());
          }
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

  const handleManageCorner = (cornerId) => {
    navigate(`/EditCorner`, { state: { cornerId } });
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const renderCornerData = () => {
    if (!cornerData || !selectedSeason) {
      return <p>Loading corner data...</p>;
    }

    // Filter cornerData based on the selected season year
    const filteredCornerData = cornerData.filter(
      (corner) => corner.seasonYear === parseInt(selectedSeason)
    );

    // Group the filtered corner data by race name
    // print a line to distinguish between the two snippets
    const groupedCornerData = filteredCornerData.reduce((acc, corner) => {
      if (!acc[corner.race.raceName]) {
        acc[corner.race.raceName] = [];
      }
      acc[corner.race.raceName].push(corner);
      return acc;
    }, {});

    if (Object.keys(groupedCornerData).length === 0) {
      return <p>No data available for the selected season.</p>;
    }

    return (
      <>
        {Object.entries(groupedCornerData).map(([raceName, corners]) => (
          <div key={raceName}>
            <hr style={{ marginTop: '50px' }}></hr>
            <h2>{raceName}</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '5%' }}>SL No</TableCell>
                    <TableCell style={{ width: '15%' }}>Corner Number</TableCell>
                    <TableCell style={{ width: '15%' }}>Corner Capacity</TableCell>
                    <TableCell style={{ width: '15%' }}>Season</TableCell>
                    <TableCell style={{ width: '20%' }}>Race Name</TableCell>
                    <TableCell style={{ width: '15%' }}>Available Capacity</TableCell>
                    <TableCell style={{ width: '15%' }}>Manage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {corners.map((corner, index) => (
                    <TableRow key={corner.cornerId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{corner.cornerNumber}</TableCell>
                      <TableCell>{corner.cornerCapacity}</TableCell>
                      <TableCell>{corner.seasonYear}</TableCell>
                      <TableCell>{corner.race ? corner.race.raceName : ''}</TableCell>
                      <TableCell>{corner.availableCapacity}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleManageCorner(corner.cornerId)}
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
        ))}
      </>
    );
  };



  return (
    <div className="cornerlistadmin">
      <AdminNavbar />
      <br />
      <br />
      <br />
      <br />
      <h1>Corner List</h1>
      <div className="SeasonAndRaceSelection">
        <p style={{ display: 'inline-block', marginRight: '10px', fontSize: '30px' }}>Select Season: </p>
        <select
          value={selectedSeason}
          onChange={handleSeasonChange}
          style={{
            display: 'inline-block',
            minWidth: '150px',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            fontSize: '16px',
          }}
        >
          {seasonData &&
            seasonData.map((season) => (
              <option
                key={season.seasonId}
                value={season.year.toString()}
                style={{ backgroundColor: '#fff', color: '#333' }}
              >
                {season.year}
              </option>
            ))}
        </select>
      </div>

      {renderCornerData()}
      <br />
      <Footer />
    </div>
  );

};

export default CornerListAdmin;
