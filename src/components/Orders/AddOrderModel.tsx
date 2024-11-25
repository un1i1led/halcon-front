import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import * as yup from 'yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import debounce from '../../utils/debounce';
import { Row } from '../../types/TableTypes';

interface Customer {
  customerNumber: string;
  name: string;
}

interface AddOrderModelProps {
  open: boolean;
  onClose: () => void;
  onOrderSaved: () => void;
  selectedOrder: Partial<Row> | null;
}

interface FormData {
  customerNumber: string;
  deliveryAddress?: string;
  notes?: string;
}

const AddOrderModel = ({ open, onClose, onOrderSaved, selectedOrder }: AddOrderModelProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    customerNumber: yup.string().required('Cliente es requerido'),
    deliveryAddress: yup.string(),
    notes: yup.string(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      customerNumber: selectedOrder?.customerNumber as string || '',
      deliveryAddress: selectedOrder?.deliveryAddress as string || '',
      notes: selectedOrder?.notes as string || '',
    },
    resolver: yupResolver(schema),
  });

  const searchCustomers = debounce(async (searchTerm: string) => {
    if (!searchTerm) return;
    try {
      setLoading(true);
      const response = await api.get('customers', {
        params: { search: searchTerm },
      });
      setCustomers(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      if (selectedOrder) {
        await api.put(`orders/${selectedOrder.id}`, data);
      } else {
        await api.post('orders', data);
      }
      onOrderSaved();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) {
      reset({
        customerNumber: selectedOrder?.customerNumber as string || '',
        deliveryAddress: selectedOrder?.deliveryAddress as string || '',
        notes: selectedOrder?.notes as string || '',
      });

      if (selectedOrder?.customerNumber) {
        setCustomers([selectedOrder?.customer as unknown as Customer])
        setValue('customerNumber', selectedOrder?.customerNumber as string);
      }
    } else {
      reset();
      setCustomers([]);
    }
  }, [open, reset, selectedOrder, setValue]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>{selectedOrder ? 'Editar Orden' : 'Agregar Orden'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name='customerNumber'
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Autocomplete
                {...field}
                options={customers}
                value={customers.find((customer) => customer.customerNumber === value) || null}
                getOptionLabel={(option: Customer) => option.name}
                loading={loading}
                onInputChange={(_, newInputValue) => {
                  if (newInputValue.length >= 2) {
                    searchCustomers(newInputValue);
                  } else {
                    setCustomers([]);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Cliente'
                    margin='normal'
                    error={!!errors.customerNumber}
                    helperText={errors.customerNumber?.message}
                  />
                )}
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.customerNumber : '');
                }}
                isOptionEqualToValue={(option, value) =>
                  option.customerNumber === value.customerNumber
                }
              />
            )}
          />
          <TextField
            fullWidth
            id='deliveryAddress'
            label='Dirección de entrega'
            placeholder='123 Avenida Palacios, Guadalajara, Jal.'
            {...register('deliveryAddress')}
            error={!!errors.deliveryAddress}
            helperText={errors.deliveryAddress?.message}
            margin='normal'
          />
          <TextField
            placeholder='Notas de orden'
            multiline
            rows={4}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5',
              },
            }}
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
            margin='normal'
          />
          <Button type='submit' sx={{ marginY: '1rem' }}>
            {selectedOrder ? 'Actualizar' : 'Enviar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModel;
