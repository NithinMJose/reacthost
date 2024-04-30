import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import TeamSidebar from '../sidebar/TeamSidebar';
import TeamNavbar from '../LoginSignup/Team/TeamNavbar';
import Footer from '../LoginSignup/Footer';
import { BASE_URL } from '../../config';
import './UpdateProductTeam.css';

const UpdateProductTeam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state.productId;
  const [numberOfImages, setNumberOfImages] = useState(0);

  const [productData, setProductData] = useState({
    productName: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    productCategoryId: 0,
    imagePath1: '',
    imageFile1: null,
    imagePath2: '',
    imageFile2: null,
    imagePath3: '',
    imageFile3: null,
    imagePath4: '',
    imageFile4: null,
    isActive: false,
    newImageSelected1: false,
    newImageUrl1: '',
    newImageSelected2: false,
    newImageUrl2: '',
    newImageSelected3: false,
    newImageUrl3: '',
    newImageSelected4: false,
    newImageUrl4: '',
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({
    productName: '',
    description: '',
    price: '',
    stockQuantity: '',
  });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/ProductCategory/GetAllProductCategories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product categories:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Product/GetProductById?id=${productId}`)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, [productId]);

  const handleFieldChange = (field, value) => {
    setProductData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleImageUpload = (event, imageNumber) => {
    const file = event.target.files[0];

    if (!file || (file.type !== 'image/jpeg' && file.type !== 'image/png')) {
      toast.error('Please upload a valid PNG or JPG image.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProductData((prevData) => ({
      ...prevData,
      [`imageFile${imageNumber}`]: file,
      [`newImageSelected${imageNumber}`]: true,
      [`newImageUrl${imageNumber}`]: imageUrl,
    }));
  };

  const handleUpdateClick = () => {
    let formIsValid = true;
    const newErrors = {};

    if (!productData.productName.trim()) {
      newErrors.productName = 'Product name is required';
      formIsValid = false;
    }

    if (!productData.description.trim()) {
      newErrors.description = 'Description is required';
      formIsValid = false;
    }

    if (productData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      formIsValid = false;
    }

    if (productData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('productName', productData.productName);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('teamId', productData.teamId);
    formData.append('stockQuantity', productData.stockQuantity);
    formData.append('productCategoryId', productData.productCategoryId);
    formData.append('isActive', productData.isActive);

    for (let i = 1; i <= 4; i++) {
      if (productData[`imageFile${i}`]) {
        formData.append(`imageFile${i}`, productData[`imageFile${i}`]);
      }
    }

    axios
      .put(`${BASE_URL}/api/Product/UpdateProduct/${productId}`, formData)
      .then((response) => {
        toast.success('Update successful');
        navigate('/ProductListTeam');
      })
      .catch((error) => {
        console.error('Error updating product data:', error);
        toast.error('Error updating product data');
      });
  };


  return (
    <div className="productlistpage">
      <TeamNavbar />
      <br />
      <br />
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <TeamSidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                  Product Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Product Name"
                      fullWidth
                      value={productData.productName}
                      onChange={(e) => handleFieldChange('productName', e.target.value)}
                      error={!!errors.productName}
                      helperText={errors.productName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      fullWidth
                      value={productData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      value={productData.price}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      error={!!errors.price}
                      helperText={errors.price}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Stock Quantity"
                      type="number"
                      fullWidth
                      value={productData.stockQuantity}
                      onChange={(e) => handleFieldChange('stockQuantity', e.target.value)}
                      error={!!errors.stockQuantity}
                      helperText={errors.stockQuantity}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Product Category</InputLabel>
                      <Select
                        value={productData.productCategoryId}
                        onChange={(e) => handleFieldChange('productCategoryId', e.target.value)}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* Display the existing images */}
                  <Typography variant="h6" gutterBottom style={{ marginLeft: "20px" }}>existing images</Typography>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="ImageContainer">
                      <div className="Image1">
                        <p>Image1</p>
                        <img src={productData.imagePath1} alt="Product Image 1" className="product-image" />
                      </div>
                      <div className="Image2">
                        <p>Image2</p>
                        <img src={productData.imagePath2} alt="Product Image 2" className="product-image" />
                      </div>
                      <div className="Image3">
                        <p>Image3</p>
                        <img src={productData.imagePath3} alt="Product Image 3" className="product-image" />
                      </div>
                      <div className="Image4">
                        <p>Image4</p>
                        <img src={productData.imagePath4} alt="Product Image 4" className="product-image" />
                      </div>
                    </div>
                  </Grid>

                  {[1, 2, 3, 4].map((number) => (
                    <Grid item xs={12} key={number}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, number)}
                      />
                      {productData[`newImageSelected${number}`] && (
                        <>
                          <Typography variant="subtitle1">New Image selected, replacing the existing</Typography>
                          <img
                            src={productData[`newImageUrl${number}`]}
                            alt={`Product Image ${number}`}
                            className="product-image"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        </>
                      )}
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Active</InputLabel>
                      <Select
                        value={productData.isActive}
                        onChange={(e) => handleFieldChange('isActive', e.target.value)}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateClick}
                    >
                      Apply the changes to DB
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProductTeam;
