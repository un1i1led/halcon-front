import { useEffect, useState } from 'react';
import api from '../services/api';
import GenericTable from '../components/GenericTable';
import { Row, Column } from '../types/TableTypes';
import { Button, Typography } from '@mui/material';
import AddOrderModel from '../components/Orders/AddOrderModel';
import { Order } from '../types/Order';

const Dashboard = () => {
  const [orders,      setOrders      ] = useState<Row[]>([]);
  const [orderAmount, setOrderAmount ] = useState(0);
  const [addingOrder, setAddingOrder ] = useState(false);

  const getOrders = async () => {
    const response = await api.get('orders', {
      params: {page: '1', limit: '10', status: '' }
    });
    if (response.data) {
      setOrders(response.data.data);
      setOrderAmount(response.data.totalItems);
    } else {
      return;
    }
  }

  useEffect(() => {
    getOrders();
  }, [])

  const handleClose = () => {
    setAddingOrder(false);
  }

  const onOrderAdded = (newOrder: Partial<Order>) => {
    setOrders([...orders, newOrder]);
    setOrderAmount(prev => prev + 1);
  }

  const columns: Column[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'customerNumber',
      label: 'Num. Cliente'
    },
    {
      key: 'deliveryAddress',
      label: 'Dirección de entrega'
    },
    {
      key: 'notes',
      label: 'Notas'
    },
    {
      key: 'status',
      label: 'Status'
    },
    {
      key: 'createdAt',
      label: 'Creado',
      render: (value: string) => {
        const date = new Date(value);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      }
    }
  ]

  return (
    <div className='main dashboard'>
      <div className='content'>
        <div className='centered'>
          <div className='top-table'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4'>Órdenes - </Typography>
              <Typography 
                variant='h4' 
                sx={{ marginLeft: 1, color: '#AEACAC' }}
              >
                {orderAmount}
              </Typography>
            </div>
            <Button 
              variant='contained'
              onClick={() => setAddingOrder(true)}
            >
              Agregar Orden
            </Button>
          </div>
          <GenericTable columns={columns} data={orders}/>
          <AddOrderModel 
            open={addingOrder} 
            onClose={handleClose}
            onOrderAdded={onOrderAdded}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;