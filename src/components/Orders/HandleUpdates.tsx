import { Button, Stack } from '@mui/material';
import { getUserData } from '../../utils/getUserData'
import api from '../../services/api';
import { SetStateAction, Dispatch, useState } from 'react';
import HandleImage from './HandleImage';
import { Order } from '../../types/Order';

interface UpdaterProps {
  selectedRow: Order;
  setSelectedRow: Dispatch<SetStateAction<Order | null>>;
  onOrderAdded: () => void;
}

const HandleUpdates = ({ selectedRow, setSelectedRow, onOrderAdded }: UpdaterProps) => {
  const [addingImage, setAddingImage] = useState(false);
  const user = getUserData();

  const handleChange = (status: string) => {
    if (status === 'Ordered') {
      const newData = { ...selectedRow, status: 'In Process' };
      sendToDb(newData);
    }
  }

  const sendToDb = async (data: Order) => {
    const response = await api.put(`orders/${data.id}`, data)

    if (response.data) {
      setSelectedRow(response.data);
      onOrderAdded();
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    if (selectedRow.images!.length < 1) {
      formData.append('description', 'loaded');
    } else {
      formData.append('description', 'unloaded');
    }

    try {
      const response = await api.post(`orders/upload/${selectedRow.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
      })

      if (response.data.order) {
        setSelectedRow(response.data.order);
        onOrderAdded();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onClose = () => {
    setAddingImage(false);
  }

  const handleOpen = () => {
    setAddingImage(true);
  }

  const renderText = () => {
    const status = selectedRow.status;

    switch (status) {
      case 'Ordered':
        return 'Procesar';
      case 'In process':
        return 'Rutear';
      case 'In route':
        return 'Entregar'
    }
  }

  const renderButton = () => {
    const status = selectedRow.status;
    const role = user.role;

    if (selectedRow.status === 'Delivered') return false;

    if (role === 'admin') return true;

    if (role === 'purchasing' && status === 'Ordered') return true;
    if (role === 'warehouse' && status !== 'Ordered') return true;
    if (role === 'route' && status !== 'In route') return false;

    return false;
  }

  return (
    <Stack 
        spacing={2} 
        direction={'row'}
      >
        {renderButton() && (
          <Button onClick={() => handleChange(selectedRow.status as string)}>
            {renderText()}
          </Button>
        )}
        <HandleImage 
          selectedRow={selectedRow as unknown as Order}
          open={addingImage}
          handleOpen={handleOpen}
          onClose={onClose}
          onUpload={handleImageUpload}
        />
      </Stack>
  )
}

export default HandleUpdates;