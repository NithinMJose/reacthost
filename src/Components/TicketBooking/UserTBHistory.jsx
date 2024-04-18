import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import UserNavbar from '../LoginSignup/UserNavbar';
import Footer from '../LoginSignup/Footer';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { BASE_URL } from '../../config';

const UserTBHistory = () => {
  const [ticketBookingHistory, setTicketBookingHistory] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const [userIdDecode, setUserId] = useState('');


  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    const fetchTicketBookingHistory = async () => {
      try {
        const decodedToken = jwt_decode(token);
        const response = await axios.get(`${BASE_URL}/api/TicketBooking/GetTicketBookingHistoryByUserId/${decodedToken.userId}`);
        const enhancedHistory = await Promise.all(
          response.data.map(async (booking) => {
            try {
              const seasonResponse = await axios.get(`${BASE_URL}/api/Season/GetSeasonById?id=${booking.seasonId}`);
              const raceResponse = await axios.get(`${BASE_URL}/api/Race/GetRaceById?id=${booking.raceId}`);
              const cornerResponse = await axios.get(`${BASE_URL}/api/Corner/GetCornerById?id=${booking.cornerId}`);
              const categoryResponse = await axios.get(`${BASE_URL}/api/TicketCategory/GetTicketCategoryById?id=${booking.ticketCategoryId}`);

              return {
                ...booking,
                year: seasonResponse.data?.year,
                raceName: raceResponse.data?.raceName,
                cornerNumber: cornerResponse.data?.cornerNumber,
                categoryName: categoryResponse.data?.categoryName,
              };
            } catch (error) {
              console.error('Error fetching additional details:', error);
              return booking;
            }
          })
        );

        enhancedHistory.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setTicketBookingHistory(enhancedHistory);
      } catch (error) {
        console.error('Error fetching ticket booking history:', error);
      }
    };

    fetchTicketBookingHistory();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const handlePrintTicket = (booking) => {
    alert(`Printing the ticket for Booking ID: ${booking.ticketBookingId}`);
  };

  return (
    <div>
      <UserNavbar />
      <Container sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Ticket Booking History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl No</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Race Name</TableCell>
                  <TableCell>Number of Tickets</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketBookingHistory.map((booking, index) => (
                  <TableRow key={booking.ticketBookingId} onClick={() => handleViewDetails(booking)}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.year}</TableCell>
                    <TableCell>{booking.raceName}</TableCell>
                    <TableCell>{booking.numberOfTicketsBooked}</TableCell>
                    <TableCell>{new Date(booking.bookingDate).toLocaleString()}</TableCell>
                    <TableCell>{booking.paymentStatus}</TableCell>
                    <TableCell>
                      <Button variant="outlined">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Footer />

      <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Booking Details</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Secured Ticket ID</TableCell>
                  <TableCell>{selectedBooking?.uniqueId || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>{selectedBooking?.year}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Race Name</TableCell>
                  <TableCell>{selectedBooking?.raceName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Corner Number</TableCell>
                  <TableCell>{selectedBooking?.cornerNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ticket Category</TableCell>
                  <TableCell>{selectedBooking?.categoryName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Number of Tickets Booked</TableCell>
                  <TableCell>{selectedBooking?.numberOfTicketsBooked}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>{new Date(selectedBooking?.bookingDate).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>${selectedBooking?.totalAmount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>{selectedBooking?.paymentStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>
                    {selectedBooking?.paymentDate ? new Date(selectedBooking?.paymentDate).toLocaleString() : '-'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Confirmation Number</TableCell>
                  <TableCell>{selectedBooking?.confirmationNumber || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Booking Status</TableCell>
                  <TableCell>{selectedBooking?.bookingStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>{selectedBooking?.firstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Name</TableCell>
                  <TableCell>{selectedBooking?.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>{selectedBooking?.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{selectedBooking?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone Contact</TableCell>
                  <TableCell>{selectedBooking?.phoneContact}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant="outlined" color="primary" onClick={() => handlePrintTicket(selectedBooking)}>
              Print the Ticket
            </Button>
          </DialogActions>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTBHistory;
