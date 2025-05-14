import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  Zoom,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Add,
  Close,
  Search,
  Title as TitleIcon,
  Description as DescriptionIcon,
  ErrorOutline,
  CheckCircleOutline,
  WarningAmber,
  AccessTime,
} from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';

// Styled Components
const MetricCard = styled(Card)(({ theme }) => ({
  height: '140px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '& .MuiTableCell-head': {
    fontWeight: 600,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(2),
    '& .MuiTypography-root': {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
}));

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const token = localStorage.getItem('token');

  // Metrics calculation
  const metrics = {
    total: tickets.length,
    open: tickets.filter(ticket => ticket.status === 'Open').length,
    breached: tickets.filter(ticket => ticket.status === 'Breached').length,
    resolved: tickets.filter(ticket => ticket.status === 'Resolved').length,
  };

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BaseUrl}/tickets`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Ticket created successfully!');
      handleCloseDialog();
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ title: '', description: '' });
  };

  const getStatusChipProps = (status) => {
    const props = {
      Open: { color: 'primary', icon: <AccessTime /> },
      Breached: { color: 'error', icon: <ErrorOutline /> },
      Resolved: { color: 'success', icon: <CheckCircleOutline /> },
      Pending: { color: 'warning', icon: <WarningAmber /> },
    };
    return props[status] || props.Open;
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await axios.put(`${BaseUrl}/tickets/${ticketId}`, { status: newStatus }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Ticket status updated successfully!');
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error(error.response?.data?.message || 'Failed to update ticket status');
    }
  };

  const handleStatusChange = (ticket) => {
    const nextStatus = {
      'Open': 'Resolved',
      'Breached': 'Resolved',
      'Resolved': 'Open',
      'Pending': 'Resolved'
    };

    Swal.fire({
      title: 'Update Ticket Status',
      text: `Change status from ${ticket.status} to ${nextStatus[ticket.status]}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(ticket._id, nextStatus[ticket.status]);
      }
    });
  };

  // Update the table to show resolvedAt date and better format dates
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Support Tickets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Raise and track your support requests
        </Typography>
      </Box>

      {/* Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Tickets', value: metrics.total, color: '#3b82f6' },
          { title: 'Open', value: metrics.open, color: '#0ea5e9' },
          { title: 'Breached', value: metrics.breached, color: '#ef4444' },
          { title: 'Resolved', value: metrics.resolved, color: '#22c55e' },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard>
              <CardContent sx={{ height: '100%', p: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {metric.title}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    color: metric.color,
                    mt: 2
                  }}
                >
                  {metric.value}
                </Typography>
              </CardContent>
            </MetricCard>
          </Grid>
        ))}
      </Grid>

      {/* Actions Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '12px 24px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
            }
          }}
        >
          Raise Ticket
        </Button>
      </Box>

      {/* Tickets Table */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Raised By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Resolved At</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket._id} hover>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>
                  <Tooltip 
                    title={ticket.description}
                    TransitionComponent={Zoom}
                    placement="top-start"
                  >
                    <Typography
                      sx={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {ticket.description}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status}
                    size="small"
                    icon={getStatusChipProps(ticket.status).icon}
                    color={getStatusChipProps(ticket.status).color}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip 
                    title={`Employee ID: ${ticket.raisedBy.employeeId}`}
                    TransitionComponent={Zoom}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{ticket.raisedBy.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.raisedBy.email}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  {ticket.resolvedAt ? (
                    new Date(ticket.resolvedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Not resolved yet
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip 
                    title="Assigned HR"
                    TransitionComponent={Zoom}
                  >
                    <Typography variant="body2">
                      {ticket.assignedTo}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip 
                    title={`Mark as ${ticket.status === 'Resolved' ? 'Open' : 'Resolved'}`}
                    TransitionComponent={Zoom}
                  >
                    <IconButton
                      onClick={() => handleStatusChange(ticket)}
                      size="small"
                      sx={{
                        color: ticket.status === 'Resolved' ? 'error.main' : 'success.main',
                        '&:hover': {
                          backgroundColor: ticket.status === 'Resolved' 
                            ? 'rgba(239, 68, 68, 0.1)' 
                            : 'rgba(34, 197, 94, 0.1)',
                        }
                      }}
                    >
                      {ticket.status === 'Resolved' ? (
                        <ErrorOutline fontSize="small" />
                      ) : (
                        <CheckCircleOutline fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Create Ticket Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add color="primary" />
            <Typography>Raise New Ticket</Typography>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'text.secondary'
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }
            }}
          >
            Submit Ticket
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default TicketsPage;