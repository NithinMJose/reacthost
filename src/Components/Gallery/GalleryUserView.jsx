import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, styled, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';

const StyledContainer = styled(Container)`
  margin-top: 20px;
`;

const StyledCard = styled(Card)`
  min-width: 300px;
  max-width: 300px;
  min-height: 300px;
  max-height: 300px;
  margin: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 200px;
  cursor: pointer;
`;

const GalleryUserView = () => {
  const [galleryList, setGalleryList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/Gallery/GetAllImages`);
        const data = await response.json();
        setGalleryList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
    setDialogOpen(false);
  };

  return (
    <div>
      <UserNavbar />
      <div className='container-fluid' style={{ backgroundColor: '#f8f9fa', marginTop: "90px" }}>
      <StyledContainer>
          <Typography variant="h4" align="center" gutterBottom >
          Gallery
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {galleryList.map((image) => (
            <StyledCard key={image.imageId}>
              <StyledCardMedia
                component="img"
                alt={image.caption}
                height="200" // Set a fixed height for all images
                image={`${BASE_URL}/images/${image.imageUrl}`}
                onClick={() => handleImageClick(image)}
              />
              <CardContent>
                <Typography variant="h6" component="div" align="center">
                  {image.caption}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
        </div>
      </StyledContainer>

      {/* Image Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xl">
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1, margin: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
                src={`${BASE_URL}/images/${selectedImage.imageUrl}`}
              alt={selectedImage.caption}
              style={{ width: 'auto', height: '100%' }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Footer />
      <br />
    </div>
    </div>
  );
};

export default GalleryUserView;
