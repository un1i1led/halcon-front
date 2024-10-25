import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { Order } from '../../types/Order';
import * as yup from 'yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import debounce from '../../utils/debounce';

interface Customer {
  customerNumber: string;
  name: string;
}

interface AddOrderModelProps {
  open: boolean;
  onClose: () => void;
  onOrderAdded: (newOrder: Partial<Order>) => void;
}

interface FormData {
  customerNumber: string;
  deliveryAddress?: string;
  notes?: string;
}

const AddOrderModel = ({ open, onClose, onOrderAdded}: AddOrderModelProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    customerNumber: yup
      .string()
      .required('Cliente es requerido'),
    deliveryAdress: yup
      .string(),
    notes: yup
      .string()
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    defaultValues: {
      customerNumber: '',
      deliveryAddress: '',
      notes: ''
    },
    resolver: yupResolver(schema)
  })

  const searchCustomers = debounce(async (searchTerm: string) => {
    try {
      setLoading(true);
      const response = await api.get('customers', {
        params: { search: searchTerm }
      });
      if (response.data.data.length > 0) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setLoading(false);
    }
  }, 500)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const response = await api.post('orders', data);
      onOrderAdded(response.data);

      onClose();
    } catch {
      return;
    }
  }

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'> 
      <DialogTitle>Agregar Orden</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="customerNumber"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Autocomplete
                {...field}
                options={customers}
                value={customers.find(customer => customer.customerNumber === value) || null}
                getOptionLabel={(option: Customer) => option.name}
                loading={loading}
                onInputChange={(_, newInputValue) => {
                  if (newInputValue.length >= 2) {
                    searchCustomers(newInputValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente"
                    margin="normal"
                    error={!!errors.customerNumber}
                    helperText={errors.customerNumber?.message}
                  />
                )}
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.customerNumber : '');
                }}
                isOptionEqualToValue={(option, value) => option.customerNumber === value.customerNumber}
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
                backgroundColor: '#f5f5f5'
              }
            }}
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
            margin='normal'
          />
          <Button
            type='submit'
            sx={{ margin: '1rem' }}
          >
            Enviar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddOrderModel;