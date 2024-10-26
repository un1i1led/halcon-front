import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import api from '../services/api';
import '../styles/OrderDetail.css';
import { useState } from 'react';
import { Order } from '../types/Order';
import OrderInfo from '../components/OrderDetail/OrderInfo';

interface FormData {
  customerNumber: string;
  orderId: string;
}

const OrderDetail = () => {
  const [order, setOrder] = useState<Order | null>(null);

  const schema = yup.object({
    customerNumber: yup
      .string().min(6)
      .required()
      .matches(/^\d+$/),
    orderId: yup
      .string()
      .required()
      .matches(/^\d+$/)
  })

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      customerNumber: '',
      orderId: ''
    },
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      console.log(data);
      const response = await api.get(
        `orders/${data.customerNumber}/${data.orderId}`
      );

      if (response.data) {
        setOrder(response.data);
      }
      return;
    } catch {
      return;
    }
  }

  return (
    <div className='order-detail'>
      <div>
        <div className='header'>
          <Typography variant='h2'>
            Busca tu orden
          </Typography>
        </div>
        <Box 
          className='order-content'
          sx={{ display: 'grid' }}
        >
          <Box className='modal'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box sx={{ 
                display: 'flex', 
                gap: '1rem',
              }}>
                <TextField
                  fullWidth
                  id='customer-number'
                  label='Num. Cliente'
                  type='text'
                  placeholder='123456'
                  {...register('customerNumber')}
                  error={!!errors.customerNumber}
                  helperText={errors.customerNumber?.message}
                  margin='normal'
                />
                <TextField
                  fullWidth
                  id='order-id'
                  label='Id Orden'
                  type='text'
                  placeholder='1'
                  {...register('orderId')}
                  error={!!errors.orderId}
                  helperText={errors.orderId?.message}
                  margin='normal'
                />
              </Box>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                sx={{ marginY: '1rem' }}
              >
                Buscar
              </Button>
            </form>
          </Box>
          <div className='divider-div'>
            <div className="divider"></div>
          </div>
          <Box className='info'>
            {order && (
              <OrderInfo order={order}/>
            )}
          </Box>
        </Box>
      </div>
    </div>
  )
}

export default OrderDetail;
