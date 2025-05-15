import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Avatar,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Tooltip,
    Divider,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Email as EmailIcon,
    Badge as BadgeIcon,
    Work as WorkIcon,
    Group as GroupIcon,
    LocalHospital as BloodIcon,
    PhotoCamera as CameraIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';
import BaseUrl from '../Api';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';


const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editedProfile, setEditedProfile] = useState(null);
    const token = localStorage.getItem('token');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/employees/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data);
            setEditedProfile(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(
                `${BaseUrl}/employees/profile/${profile._id}`,
                editedProfile,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setProfile(response.data);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleChange = (e) => {
        setEditedProfile({
            ...editedProfile,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        position: 'relative',
                        borderRadius: '30px',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {/* Profile Header */}
                    <Box
                        sx={{
                            height: '200px',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                            position: 'relative',
                        }}
                    />

                    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, pb: 4, mt: -10 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={imagePreview || profile?.profilePicture}
                                    sx={{
                                        width: 180,
                                        height: 180,
                                        border: '4px solid white',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                                        mb: 2,
                                    }}
                                >
                                    {!imagePreview && profile?.name?.charAt(0)}
                                </Avatar>
                                {isEditing && (
                                    <Box
                                        component="label"
                                        htmlFor="profile-image-input"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 20,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            borderRadius: '50%',
                                            width: 40,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: '2px solid white',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                        }}
                                    >
                                        <CameraIcon sx={{ color: 'white' }} />
                                        <input
                                            type="file"
                                            id="profile-image-input"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textAlign: 'center',
                                    mb: 1,
                                }}
                            >
                                {profile?.name}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Chip
                                    icon={<BadgeIcon />}
                                    label={profile?.employeeId}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<WorkIcon />}
                                    label={profile?.role}
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Box>

                            {!isEditing ? (
                                <Button
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={handleEdit}
                                    sx={{
                                        mt: 3,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
                                        }
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleCancel}
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                        sx={{
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                                            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
                                            }
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                                    Personal Information
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={isEditing ? editedProfile?.name : profile?.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        InputProps={{
                                            startAdornment: (
                                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={isEditing ? editedProfile?.email : profile?.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        InputProps={{
                                            startAdornment: (
                                                <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            }
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                                    Work Information
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            name="role"
                                            value={isEditing ? editedProfile?.role : profile?.role}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            startAdornment={<WorkIcon sx={{ mr: 1, color: 'primary.main' }} />}
                                            sx={{
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            }}
                                        >
                                            <MenuItem value="HR">HR</MenuItem>
                                            <MenuItem value="Developer">Developer</MenuItem>
                                            <MenuItem value="DevOps">DevOps</MenuItem>
                                            <MenuItem value="Designer">Designer</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Team</InputLabel>
                                        <Select
                                            name="team"
                                            value={isEditing ? editedProfile?.team : profile?.team}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            startAdornment={<GroupIcon sx={{ mr: 1, color: 'primary.main' }} />}
                                            sx={{
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            }}
                                        >
                                            <MenuItem value="Technical">Technical</MenuItem>
                                            <MenuItem value="Design">Design</MenuItem>
                                            <MenuItem value="Management">Management</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Blood Group</InputLabel>
                                        <Select
                                            name="bloodGroup"
                                            value={isEditing ? editedProfile?.bloodGroup : profile?.bloodGroup}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            startAdornment={<BloodIcon sx={{ mr: 1, color: 'primary.main' }} />}
                                            sx={{
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            }}
                                        >
                                            <MenuItem value="A+">A+</MenuItem>
                                            <MenuItem value="A-">A-</MenuItem>
                                            <MenuItem value="B+">B+</MenuItem>
                                            <MenuItem value="B-">B-</MenuItem>
                                            <MenuItem value="O+">O+</MenuItem>
                                            <MenuItem value="O-">O-</MenuItem>
                                            <MenuItem value="AB+">AB+</MenuItem>
                                            <MenuItem value="AB-">AB-</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default ProfilePage;