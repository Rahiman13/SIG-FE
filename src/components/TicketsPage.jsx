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
  TablePagination,
  CircularProgress,
  alpha,
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
  Refresh,
  ArrowUpward,
  Timeline,
  PriorityHigh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// Enhanced Styled Components
const MetricCard = styled(motion.div)(({ theme, color }) => ({
  height: '100%',
  minHeight: '180px',
  borderRadius: '24px',
  background: `linear-gradient(135deg, ${alpha(color, 0.12)} 0%, ${alpha(color, 0.05)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `2px solid ${alpha(color, 0.1)}`,
  boxShadow: `0 10px 30px -5px ${alpha(color, 0.2)}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px -10px ${alpha(color, 0.3)}`,
    '& .metric-icon': {
      transform: 'scale(1.1) rotate(10deg)',
    },
    '& .metric-shine': {
      transform: 'rotate(45deg) translate(100%, -100%)',
    },
    '& .metric-glow': {
      opacity: 0.8,
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: `linear-gradient(180deg, ${alpha(color, 0.15)} 0%, transparent 100%)`,
    borderRadius: '24px',
  },
  '& .metric-shine': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '200%',
    background: `linear-gradient(45deg, transparent 40%, ${alpha(color, 0.1)} 45%, ${alpha(color, 0.2)} 50%, ${alpha(color, 0.1)} 55%, transparent 60%)`,
    transform: 'rotate(45deg) translate(-100%, 100%)',
    transition: 'transform 0.7s ease',
  },
  '& .metric-glow': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120%',
    height: '120%',
    background: `radial-gradient(circle, ${alpha(color, 0.4)} 0%, transparent 70%)`,
    transform: 'translate(-50%, -50%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  }
}));

const MetricIconWrapper = styled(Box)(({ color }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.1)} 100%)`,
  backdropFilter: 'blur(5px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  position: 'relative',
  transition: 'transform 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '-2px',
    borderRadius: '22px',
    padding: '2px',
    background: `linear-gradient(135deg, ${alpha(color, 0.4)} 0%, transparent 100%)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '24px',
  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
  '& .MuiTableCell-head': {
    fontWeight: 600,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderBottom: '2px solid rgba(59, 130, 246, 0.1)',
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.02)',
    },
  },
}));

const StatusButton = styled(Button)(({ theme, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return theme.palette.primary.main;
      case 'Resolved': return theme.palette.success.main;
      case 'Breached': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  return {
    borderRadius: '12px',
    padding: '6px 16px',
    textTransform: 'none',
    backgroundColor: alpha(getStatusColor(status), 0.1),
    color: getStatusColor(status),
    border: `1px solid ${alpha(getStatusColor(status), 0.2)}`,
    '&:hover': {
      backgroundColor: alpha(getStatusColor(status), 0.2),
      border: `1px solid ${alpha(getStatusColor(status), 0.3)}`,
    },
  };
});

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

  const handleUpdateTicketStatus = async (ticket, currentStatus) => {
    // Show confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: `${currentStatus === 'Open' ? 'Resolve' : 'Reopen'} Ticket?`,
      html: `Are you sure you want to ${currentStatus === 'Open' ? 'resolve' : 'reopen'} this ticket?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'Open' ? '#22c55e' : '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: currentStatus === 'Open' ? 'Yes, Resolve it!' : 'Yes, Reopen it!',
      cancelButtonText: 'Cancel',
      background: 'rgba(255, 255, 255, 0.9)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (result.isConfirmed) {
      try {
        const newStatus = currentStatus === 'Open' ? 'Resolved' : 'Open';
        
        // Prepare update data with all required fields
        const updateData = {
          title: ticket.title,
          description: ticket.description,
          status: newStatus
        };

        console.log('Updating ticket with data:', updateData);
        
        const response = await axios.put(
          `${BaseUrl}/tickets/${ticket._id}`,
          updateData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data) {
          Swal.fire({
            title: 'Success!',
            text: `Ticket ${newStatus === 'Resolved' ? 'resolved' : 'reopened'} successfully`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchTickets();
        }
      } catch (error) {
        console.error('Error updating ticket status:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to update ticket status',
          icon: 'error'
        });
      }
    }
  };

  // Metrics with icons and descriptions
  const metricConfigs = [
    {
      title: 'Total Tickets',
      value: metrics.total,
      color: '#3b82f6',
      icon: <Timeline sx={{ fontSize: 32 }} />,
      description: 'All tickets in the system',
      trend: '+12% from last month'
    },
    {
      title: 'Open Tickets',
      value: metrics.open,
      color: '#0ea5e9',
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      description: 'Awaiting resolution',
      trend: 'Active cases'
    },
    {
      title: 'Breached SLA',
      value: metrics.breached,
      color: '#ef4444',
      icon: <PriorityHigh sx={{ fontSize: 32 }} />,
      description: 'Past due date',
      trend: 'Needs attention'
    },
    {
      title: 'Resolved',
      value: metrics.resolved,
      color: '#22c55e',
      icon: <CheckCircleOutline sx={{ fontSize: 32 }} />,
      description: 'Successfully completed',
      trend: '95% resolution rate'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header Section */}
      <Box sx={{ mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              display: 'inline-block'
            }}
          >
            Support Tickets Dashboard
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="body1" color="text.secondary">
            Track and manage support requests efficiently
          </Typography>
        </motion.div>
      </Box>

      {/* Enhanced Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricConfigs.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MetricCard color={metric.color}>
                <div className="metric-shine" />
                <div className="metric-glow" />
                <CardContent sx={{ height: '100%', p: 3, position: 'relative', zIndex: 1 }}>
                  <MetricIconWrapper color={metric.color} className="metric-icon">
                    {React.cloneElement(metric.icon, { sx: { color: metric.color } })}
                  </MetricIconWrapper>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: alpha(metric.color, 0.9),
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {metric.title}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: metric.color,
                      mb: 1
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: alpha(metric.color, 0.7),
                        fontWeight: 500,
                        mb: 0.5
                      }}
                    >
                      {metric.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha(metric.color, 0.6),
                        fontWeight: 500,
                        display: 'block'
                      }}
                    >
                      {metric.trend}
                    </Typography>
                  </Box>
                </CardContent>
              </MetricCard>
            </motion.div>
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

      {/* Enhanced Table Section */}
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
              <TableCell>Actions</TableCell>
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
                    sx={{
                      fontWeight: 600,
                      borderRadius: '8px',
                      '& .MuiChip-icon': {
                        color: 'inherit'
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip 
                    title={`Employee ID: ${ticket.raisedBy.employeeId}`}
                    TransitionComponent={Zoom}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {ticket.raisedBy.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.raisedBy.email}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  <StatusButton
                    variant="outlined"
                    status={ticket.status}
                    onClick={() => handleUpdateTicketStatus(ticket, ticket.status)}
                    startIcon={ticket.status === 'Open' ? <CheckCircleOutline /> : <Refresh />}
                  >
                    {ticket.status === 'Open' ? 'Mark Resolved' : 'Reopen'}
                  </StatusButton>
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