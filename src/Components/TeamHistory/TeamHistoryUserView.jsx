import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, Divider } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import Footer from '../LoginSignup/Footer';
import UserNavbar from '../LoginSignup/UserNavbar';
import { BASE_URL } from '../../config';

const TeamHistoryUserView = () => {
  const [teamHistories, setTeamHistories] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [uniqueTeamNames, setUniqueTeamNames] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeamHistory, setSelectedTeamHistory] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/TeamHistory/GetAllTeamHistories`)
      .then((response) => {
        const uniqueNames = [...new Set(response.data.map((history) => history.teamName))];
        setUniqueTeamNames(uniqueNames);
        setTeamHistories(response.data);
        setShowContent(true);
      })
      .catch((error) => {
        console.error('Error fetching Team histories:', error);
      });
  }, []);

  const fadeIn = useSpring({
    opacity: showContent ? 1 : 0,
    from: { opacity: 0 },
  });

  const handleTeamClick = (teamName) => {
    const selectedTeam = teamHistories.find((history) => history.teamName === teamName);
    setSelectedTeamId(selectedTeam.teamId);
    const teamHistory = teamHistories.filter((history) => history.teamId === selectedTeam.teamId);
    setSelectedTeamHistory(teamHistory);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeamId(null);
  };

  return (
    <div>
      <UserNavbar />
      <div className="team-history-user-view-container" style={{ marginTop: '100px' }}>
        <animated.div style={fadeIn} className="team-history-user-view-content">
          <div>
            <Typography variant="h6" color="primary" gutterBottom style={{ fontSize: '24px' }}>
              Team History
            </Typography>
            <List>
              {uniqueTeamNames.map((teamName) => (
                <animated.div key={teamName} style={fadeIn} onClick={() => handleTeamClick(teamName)}>
                  <ListItem disablePadding>
                    <Typography variant="subtitle1" style={{ fontSize: '25px', cursor: 'pointer' }}>
                      {teamName}
                    </Typography>
                  </ListItem>
                  <Divider />
                </animated.div>
              ))}
            </List>
          </div>
        </animated.div>
      </div>
      <br />
      <Footer />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedTeamHistory ? selectedTeamHistory[0].teamName : ''} History</DialogTitle>
        <DialogContent>
          {selectedTeamHistory &&
            selectedTeamHistory.map((history) => (
              <div key={history.historyId}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {history.heading}
                </Typography>
                <Typography variant="body1" paragraph style={{ fontSize: '18px' }}>
                  {history.paragraph}
                </Typography>
                <Divider />
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TeamHistoryUserView;
