import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  Fade,
} from '@mui/material';
import {
  ArrowBack,
  AccessTime,
  Category,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import BaseUrl from '../Api';

const CardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BaseUrl}/cards/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCard(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching card details:', err);
        setError('Failed to load card details');
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/cards');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  if (!card) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography align="center">Card not found</Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
      }}
    >
      {/* Animated background elements */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            rotate: -360,
            transition: { duration: 50, repeat: Infinity, ease: "linear" }
          }}
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '-50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%)',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'fixed',
              top: 20,
              left: { xs: 20, md: 40 },
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}
          >
            <ArrowBack />
          </IconButton>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            {card.image && (
              <Box
                sx={{
                  width: '100%',
                  height: { xs: '300px', md: '500px' },
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: { xs: 3, md: 6 },
                    color: 'white',
                  }}
                >
                  <Fade in timeout={1000}>
                    <Box>
                      <Chip
                        label={card.type}
                        sx={{
                          mb: 2,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          backdropFilter: 'blur(4px)',
                        }}
                        icon={<Category sx={{ color: 'white !important' }} />}
                      />
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          mb: 2,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <AccessTime sx={{ fontSize: 20 }} />
                        <Typography variant="subtitle1">
                          {new Date(card.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                </Box>
              </Box>
            )}

            <Box sx={{ p: { xs: 3, md: 6 } }}>
              {!card.image && (
                <>
                  <Chip
                    label={card.type}
                    sx={{ mb: 2 }}
                    icon={<Category />}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 4,
                    }}
                  >
                    <AccessTime sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 4 }} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {card.description.map((block, index) => {
                  switch (block.type) {
                    case 'heading':
                      return (
                        <Typography
                          key={block._id || index}
                          variant="h4"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 3,
                          }}
                        >
                          {block.value}
                        </Typography>
                      );
                    case 'paragraph':
                      return (
                        <Typography
                          key={block._id || index}
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            mb: 4,
                            lineHeight: 1.8,
                            fontSize: '1.1rem',
                          }}
                        >
                          {block.value}
                        </Typography>
                      );
                    case 'list':
                      return (
                        <Box
                          key={block._id || index}
                          component="ul"
                          sx={{
                            pl: 4,
                            mb: 4,
                          }}
                        >
                          {block.value.split('\n').map((item, i) => (
                            <Typography
                              key={i}
                              component="li"
                              sx={{
                                color: 'text.secondary',
                                mb: 2,
                                fontSize: '1.1rem',
                              }}
                            >
                              {item}
                            </Typography>
                          ))}
                        </Box>
                      );
                    case 'quote':
                      return (
                        <Paper
                          key={block._id || index}
                          elevation={0}
                          sx={{
                            p: 4,
                            mb: 4,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: -20,
                              left: 20,
                              fontSize: '6rem',
                              color: 'rgba(99, 102, 241, 0.2)',
                              fontFamily: 'serif',
                            }
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontStyle: 'italic',
                              color: 'text.primary',
                              lineHeight: 1.8,
                            }}
                          >
                            {block.value}
                          </Typography>
                        </Paper>
                      );
                    default:
                      return null;
                  }
                })}
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CardDetails; 