import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import './TeamList.css';
import AdminNavbar from '../LoginSignup/AdminNavbar';
import { BASE_URL } from '../../config';

const TeamList = () => {
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Team/GetTeams`)
      .then((response) => {
        setTeamData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching team data:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          // Handle other errors if needed
        }
      });
  }, [navigate]);

  const handleManageTeam = (teamId, status) => {
    if (status === 'active') {
      axios.put(`${BASE_URL}/api/Team/DeactivateTeam?teamId=${teamId}`)
        .then(() => {
          // Handle success if needed
          // Refresh team data after deactivation
          axios.get(`${BASE_URL}/api/Team/GetTeams`)
            .then((response) => {
              setTeamData(response.data);
            })
            .catch((error) => {
              console.error('Error fetching team data:', error);
            });
        })
        .catch((error) => {
          console.error('Error deactivating team:', error);
        });
    } else if (status === 'inactive') {
      axios.put(`${BASE_URL}/api/Team/ActivateTeam?teamId=${teamId}`)
        .then(() => {
          // Handle success if needed
          // Refresh team data after activation
          axios.get(`${BASE_URL}/api/Team/GetTeams`)
            .then((response) => {
              setTeamData(response.data);
            })
            .catch((error) => {
              console.error('Error fetching team data:', error);
            });
        })
        .catch((error) => {
          console.error('Error activating team:', error);
        });
    }
  };

  const renderTeamData = () => {
    if (!teamData) {
      return <p>Loading team data...</p>;
    }

    return (
      <>
        <AdminNavbar />
        <br />
        <br />
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SL No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Team Principal</TableCell>
                <TableCell>Technical Chief</TableCell>
                <TableCell>Engine Supplier</TableCell>
                <TableCell>Chassis</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Manage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamData.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.userName}</TableCell>
                  <TableCell>{team.country}</TableCell>
                  <TableCell>{team.teamPrincipal}</TableCell>
                  <TableCell>{team.technicalChief}</TableCell>
                  <TableCell>{team.engineSupplier}</TableCell>
                  <TableCell>{team.chassis}</TableCell>
                  <TableCell>
                    {team.imagePath ? (
                      <img
                        src={`${BASE_URL}/images/${team.imagePath}`}
                        alt={`Image for ${team.name}`}
                        className="team-image"
                        style={{ maxWidth: '100%', maxHeight: '100%', width: '150px', height: '150px' }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </TableCell>
                  <TableCell>{team.status}</TableCell>
                  <TableCell>
                    {team.status !== 'not_updated' && (
                      <Button
                        variant="contained"
                        color={team.status === 'active' ? 'secondary' : 'primary'}
                        onClick={() => handleManageTeam(team.teamId, team.status)}
                      >
                        {team.status === 'active' ? 'DEACTIVATE' : 'ACTIVATE'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };


  return (
    <div className="teamlistpage">
      {renderTeamData()}
    </div>
  );
};

export default TeamList;
