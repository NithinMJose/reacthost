import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';
import { BASE_URL } from '../../config';

const TBSeason = () => {
  const [seasonsData, setSeasonsData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Season/SeasonsForBooking`);
        const fetchedSeasonsData = response.data;

        console.log('Seasons Data:', fetchedSeasonsData);

        if (fetchedSeasonsData.seasons && fetchedSeasonsData.seasons.length > 0) {
          fetchedSeasonsData.seasons.sort((a, b) => a.year - b.year);
          setSeasonsData(fetchedSeasonsData);
        } else {
          console.error('No seasons array available');
        }
      } catch (error) {
        console.error('Error fetching season details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonDetails();
  }, []);

  const handleImageClick = (uniqueSeasonName) => {
    navigate(`/TBRace/${uniqueSeasonName}`, { replace: true });
  };

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
          <p>We are loading Season data. Hang On!</p>
          <BeatLoader color={'#123abc'} loading={loading} css={override} size={30} /> {/* Adjust size here */}
          <Footer />
        </div>
      </div>
    );
  }

  if (!seasonsData || !seasonsData.seasons || seasonsData.seasons.length === 0) {
    return <p>No season details available.</p>;
  }

  return (
    <div>
      <UserNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="driver-list-container">
        {seasonsData.seasons.map((season, index) => (
          season && (
            <div key={index} className="driver-item">
              <img
                src={season.imagePath}
                alt={`Season ${season.year} Image`}
                className="driver-image"
                onClick={() => handleImageClick(season.uniqueSeasonName)}
              />
              <h2 className="driver-name">{`Season - ${season.year}`}</h2>
            </div>
          )
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default TBSeason;
