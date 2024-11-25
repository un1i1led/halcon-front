import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Row } from '../types/TableTypes';
import { ReactNode } from 'react';

interface ViewModalProps {
  open: boolean;
  title: string;
  data: Row | null;
  labels: { [key: string]: string };
  children?: ReactNode;
  onClose: () => void;
}

const SKIP_KEYS = [ 'id', 'deleted', 'customer', 'images' ];

const formatValue = (key: string, value: string) => {
  if (key === 'createdAt' || key === 'updatedAt') {
    return format(new Date(value), 'dd/MM/yyyy');
  }
  return value;
};

const ViewModal = ({ 
  open, 
  data, 
  title, 
  labels,
  children,
  onClose, 
}: ViewModalProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth='sm'
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column', 
          gap: 2, 
          padding: 2, 
          overflow: 'auto', 
        }}>
        <DialogTitle>{title}</DialogTitle>
        <Box>
          {children}
        </Box>
      </Box>
      <DialogContent dividers>
        {data &&
          Object.entries(data)
            .filter(([key]) => !SKIP_KEYS.includes(key))
            .map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', marginBottom: 1 }}>
                <Typography sx={{ fontWeight: 'bold', marginRight: 1 }}>
                  {labels[key] || key}:
                </Typography>
                <Typography>{formatValue(key, value as string)}</Typography>
              </Box>
            ))}
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;
