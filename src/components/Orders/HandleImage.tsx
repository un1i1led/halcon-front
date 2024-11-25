import { ChangeEvent, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import { styled } from '@mui/system';
import { getUserData } from '../../utils/getUserData';
import { User } from '../../types/User';
import { Order } from '../../types/Order';

interface HandlerProps {
  selectedRow: Order;
  open: boolean;
  handleOpen: () => void;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const ImagePreview = styled('canvas')(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  maxHeight: '400px',
  border: `1px solid ${theme.palette.divider}`
}));

const HandleImage = ({ selectedRow, open, handleOpen, onClose, onUpload }: HandlerProps) => {
  const user: User = getUserData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const canvas = document.getElementById('imagePreviewCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
          img.src = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await onUpload(selectedFile);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const render = () => {
    const role = user.role;
    const status = selectedRow.status;
    const images = selectedRow.images.length;

    if (images === 2) return false;
    if (status === 'Ordered') return false;

    if (role === 'admin') return true;

    if (images === 0 && role === 'warehouse') return true;
    if (images === 1 && role === 'route') return true;
    return false;
  };

  return (
    render() && (
      <>
        <Button 
          onClick={() => {
            handleOpen();
            setSelectedFile(null)
          }}>
            {selectedRow.images.length < 1 ? 'Agregar foto carga' : 'Agregar foto descarga'}
        </Button>
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>Subir Imagen</DialogTitle>
          <DialogContent>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {selectedFile && (
              <Box mt={2}>
                <ImagePreview id="imagePreviewCanvas" />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              color="primary"
              variant="contained"
              disabled={!selectedFile || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Subir'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

export default HandleImage;
