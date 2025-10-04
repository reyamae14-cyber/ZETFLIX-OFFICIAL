import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Avatar,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  GlobalStyles
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { uploadImageToSupabase, deleteImageFromSupabase, testSupabaseConnection, testUpload } from '../../utils/supabase';

const ProfilePhotoUpload = ({ 
  open, 
  onClose, 
  currentImage, 
  onImageUpdate,
  user 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      const result = await testSupabaseConnection();
      if (!result.success) {
        console.error('Supabase connection failed:', result.error);
        setError(`Connection error: ${result.error}`);
        return;
      }
      
      // If connection is successful, test upload functionality
      const uploadTest = await testUpload();
      if (!uploadTest.success) {
        console.error('Upload test failed:', uploadTest.error);
        setError(`Upload test failed: ${uploadTest.error}`);
      } else {
        console.log('Upload test successful');
      }
    };
    testConnection();
  }, []);





  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsWebcamActive(false);
    }
  }, [stream]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setError('');
      setIsWebcamActive(true);
      
      // Try front camera first (better for profile photos)
      let constraints = { 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      };
      
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        
        // Wait for video element to be ready
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Ensure video plays
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
          };
        }
      } catch (err) {
        console.warn("Front camera failed, trying any available camera:", err);
        // Fallback to any available camera
        constraints = { 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(console.error);
          };
        }
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please allow camera permissions or upload an image manually.");
      setIsWebcamActive(false);
    }
  }, []);

  // Process and upload image automatically
  const processAndUploadImage = useCallback(async (imageSrc) => {
    try {
      console.log('Starting processAndUploadImage for user:', user.id);
      setIsLoading(true);
      setError('');
      
      // For debugging, let's try a direct upload without processing first
      console.log('Converting image source to blob...');
      
      // Convert data URL to blob directly
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      console.log('Direct blob created:', blob.size, blob.type);
      
      // Upload to Supabase
      console.log('Uploading to Supabase...');
      const uploadResult = await uploadImageToSupabase(blob, user.id);
      console.log('Upload result:', uploadResult);
      
      if (uploadResult.success) {
        console.log('Upload successful, updating profile...');
        
        // Delete old image if exists
        if (user.profileImagePath && user.profileImagePath !== uploadResult.path) {
          try {
            console.log('Deleting old image:', user.profileImagePath);
            await deleteImageFromSupabase(user.profileImagePath);
          } catch (deleteErr) {
            console.warn('Failed to delete old image:', deleteErr);
          }
        }

        // Update profile with new image
        await onImageUpdate(uploadResult.url, uploadResult.path);
        
        toast.success('Profile photo updated successfully!');
        onClose();
      } else {
        console.error('Upload failed:', uploadResult.error);
        throw new Error(uploadResult.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Error in processAndUploadImage:', err);
      setError(`Failed to process image: ${err.message}`);
      toast.error(`Failed to save image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, user.profileImagePath, onImageUpdate, onClose]);

  // Capture photo from webcam
  const capturePhoto = async () => {
    if (videoRef.current && stream) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        
        stopCamera();
        
        // Process and upload automatically
        await processAndUploadImage(imageDataUrl);
      } catch (err) {
        console.error('Error capturing photo:', err);
        setError('Failed to capture photo. Please try again.');
      }
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        stopCamera();
        
        // Process and upload automatically
        await processAndUploadImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [stopCamera, processAndUploadImage]);

  // Delete current image
  const deleteCurrentImage = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Delete from Supabase if path exists
      if (user.profileImagePath) {
        await deleteImageFromSupabase(user.profileImagePath);
      }

      // Update profile to remove image
      await onImageUpdate('', '');
      
      toast.success('Profile photo deleted successfully!');
      onClose();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
      toast.error('Failed to delete image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Cleanup when dialog closes
  useEffect(() => {
    if (!open) {
      stopCamera();
      setError('');
    }
  }, [open, stopCamera]);

  return (
    <>
      <GlobalStyles
        styles={{
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.5 },
            '100%': { opacity: 1 }
          },
          // Performance optimizations
          '*': {
            boxSizing: 'border-box'
          },
          // Smooth scrolling and transitions
          '.MuiDialog-paper': {
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          },
          // Hardware acceleration for video
          'video': {
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }
        }}
      />
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        keepMounted={false}
        disableScrollLock={true}
        PaperProps={{
          sx: {
            borderRadius: 3,
            margin: 2,
            maxHeight: '90vh',
            transition: 'all 0.3s ease-in-out'
          }
        }}
        TransitionProps={{
          timeout: 300
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Profile Photo
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Upload your photo - it will be automatically optimized for your profile
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            gap={3}
          >
            {/* Current Profile Image */}
            {!isWebcamActive && (
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  width: 200, 
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(21, 101, 192, 0.05))'
                }}
              >
                <Avatar
                  src={currentImage}
                  sx={{ width: 180, height: 180 }}
                />
              </Paper>
            )}

            {/* Webcam Video */}
            {isWebcamActive && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '400px',
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.8))',
                  borderRadius: '20px',
                  padding: '20px',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Live Indicator */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    background: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'white',
                      animation: 'pulse 1.5s infinite'
                    }}
                  />
                  LIVE
                </Box>

                {/* Video */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '300px',
                    borderRadius: '15px',
                    overflow: 'hidden'
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'translateZ(0)', // Hardware acceleration
                      willChange: 'transform'
                    }}
                  />
                </Box>

                {/* Camera Controls */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mt: 3
                  }}
                >
                  <IconButton
                    onClick={capturePhoto}
                    disabled={isLoading}
                    sx={{
                      width: 70,
                      height: 70,
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.8))',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(250, 250, 250, 0.9))',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={30} />
                    ) : (
                      <PhotoCameraIcon sx={{ fontSize: 30, color: 'rgba(0, 0, 0, 0.8)' }} />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={stopCamera}
                    disabled={isLoading}
                    sx={{
                      width: 50,
                      height: 50,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <VideocamOffIcon />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* Control Buttons */}
            {!isWebcamActive && (
              <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<VideocamIcon />}
                  onClick={startCamera}
                  disabled={isLoading}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0, #0d47a1)'
                    }
                  }}
                >
                  Use Webcam
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Processing...
                    </>
                  ) : (
                    'Upload Photo'
                  )}
                </Button>

                {currentImage && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={deleteCurrentImage}
                    disabled={isLoading}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePhotoUpload;