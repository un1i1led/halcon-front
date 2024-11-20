import { useEffect, useState } from 'react';
import api from '../services/api';
import GenericTable from '../components/GenericTable';
import { Row, Column } from '../types/TableTypes';
import { Button, Stack, Typography } from '@mui/material';
import AddOrderModel from '../components/Orders/AddOrderModel';
import ViewModal from '../components/ViewModal';
import HandleUpdates from '../components/Orders/HandleUpdates';
import { getUserData } from '../utils/getUserData';

const Dashboard = () => {
  const [orders,       setOrders       ] = useState<Row[]>([]);
  const [orderAmount,  setOrderAmount  ] = useState(0);
  const [addingOrder,  setAddingOrder  ] = useState(false);
  const [viewingOrder, setViewingOrder ] = useState(false);
  const [selectedRow,  setSelectedRow  ] = useState<Row | null>(null);
  const [added,        setAdded        ] = useState(false); 
  
  const user = getUserData();

  const getOrders = async () => {
    const response = await api.get('orders', {
      params: { page: '1', limit: '10', status: '' }
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
  }, [added])

  const handleClose = () => {
    setAddingOrder(false);
  }

  const selectRow = (row: Row) => {
    setViewingOrder(true);
    setSelectedRow(row as { [key: string]: string });
  }

  const unselectRow = () => {
    setViewingOrder(false);
    setSelectedRow(null);
  }

  const handleEdit = () => {
    setViewingOrder(false);
    setAddingOrder(true);
  }

  const onOrderAdded = () => {
    setAdded(prev => !prev);
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

  const labels = {
    name: 'Nombre',
    email: 'Correo',
    role: 'Role',
    createdAt: 'Fecha Creado',
    updatedAt: 'Fecha Actualizado',
  };

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
            {['admin', 'sales'].includes(user.role) && (
              <Button 
              variant='contained'
              onClick={() => setAddingOrder(true)}
              >
                Agregar Orden
              </Button>
            )}
          </div>
          <GenericTable 
            columns={columns} 
            data={orders}
            onRowClick={selectRow}
          />
          <AddOrderModel 
            open={addingOrder} 
            onClose={handleClose}
            onOrderSaved={onOrderAdded}
            selectedOrder={selectedRow}
          />
          <ViewModal
            open={viewingOrder}
            title={
              `Orden ${selectedRow?.id} - Cliente ${selectedRow?.customerNumber}`
            }
            data={selectedRow}
            labels={labels}
            onClose={unselectRow}
          >
            <Stack 
              spacing={2} 
              direction={'row'} 
            >
              <Button onClick={handleEdit}>Editar</Button>
              {selectedRow &&
                <HandleUpdates
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                  onOrderAdded={onOrderAdded}
                />
              }
            </Stack>
          </ViewModal>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;