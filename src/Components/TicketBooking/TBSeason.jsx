import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const TBSeason = () => {
  const [seasonsData, setSeasonsData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Season/SeasonsForBooking`);
        const fetchedSeasonsData = response.data;

        console.log('Seasons Data:', fetchedSeasonsData);

        if (fetchedSeasonsData.seasons && fetchedSeasonsData.seasons.length > 0) {
          // Sort seasons by year
          fetchedSeasonsData.seasons.sort((a, b) => a.year - b.year);
          setSeasonsData(fetchedSeasonsData);
        } else {
          console.error('No seasons array available');
        }
      } catch (error) {
        console.error('Error fetching season details:', error);
      }
    };

    fetchSeasonDetails();
  }, []);

  const handleImageClick = (uniqueSeasonName) => {
    navigate(`/TBRace/${uniqueSeasonName}`, { replace: true });
  };
  

  if (!seasonsData) {
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
