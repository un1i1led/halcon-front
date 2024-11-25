import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { OrderImage } from '../types/Order';

interface ImageGalleryProps {
  open: boolean;
  onClose: () => void;
  images: OrderImage[];
  baseUrl: string;
}

const ImageGalleryDialog = ({ 
  open, 
  onClose, 
  images, 
  baseUrl 
}: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: { 
          minWidth: '900px',
          position: 'relative',
          backgroundColor: 'white',
          color: 'white'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'black'
        }}
      >
        <Close />
      </IconButton>

      <DialogTitle sx={{ textAlign: 'center' }}>
        Image {currentImageIndex + 1} of {images.length}
      </DialogTitle>

      <DialogContent sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4,
        minHeight: '400px',
        position: 'relative'
      }}>
        <IconButton
          onClick={handlePrevious}
          sx={{
            position: 'absolute',
            left: 8,
            color: 'black'
          }}
        >
          <NavigateBefore />
        </IconButton>

        <img
          src={`${baseUrl}${images[currentImageIndex].imageUrl}`}
          alt={`Image ${currentImageIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain'
          }}
        />

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 8,
            color: 'black'
          }}
        >
          <NavigateNext />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryDialog;