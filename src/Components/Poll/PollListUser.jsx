import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PollListUser.css';
import UserNavbar from '../LoginSignup/UserNavbar';
import { BASE_URL } from '../../config';

const PollListUser = () => {
  const [pollList, setPollList] = useState([]);
  const [showPreviousPolls, setShowPreviousPolls] = useState(false); // State to track whether to show previous polls
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/Poll/GetAllPolls`);
        const data = await response.json();

        // Filter polls based on polling date
        const currentDate = new Date();
        const activePolls = data.filter(poll => new Date(poll.pollingDate) > currentDate);
        const previousPolls = data.filter(poll => new Date(poll.pollingDate) <= currentDate);

        setPollList(showPreviousPolls ? previousPolls : activePolls);
        console.log('Polls:', pollList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [showPreviousPolls]); // Fetch data whenever showPreviousPolls changes

  const handleVoteClick = (pollId) => {
    navigate('/UserVote', { replace: true, state: { pollId } });
  };

  return (
    <div>
      <UserNavbar />
      <div className="poll-list-container" style={{ marginTop: "100px" }}>
        <div onClick={() => setShowPreviousPolls(!showPreviousPolls)} className="previous-polls-toggle">
          {showPreviousPolls ? "Click To See Active Polls" : "Click To See Previous Polls"}
        </div>
      </div>
      <div className="poll-list-container">
        {pollList.map((poll) => (
          <div key={poll.pollId} className="poll-item" onClick={() => handleVoteClick(poll.pollId)}>
            <h2 className="poll-question">{poll.question}</h2>
            <p className="poll-end-date">Ends on: {new Date(poll.pollingDate).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollListUser;
