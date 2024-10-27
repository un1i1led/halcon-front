import { useEffect, useState } from 'react';
import { Column, Row } from '../types/TableTypes';
import api from '../services/api';
import { Customer } from '../types/Customer';
import { Button, Typography } from '@mui/material';
import GenericTable from '../components/GenericTable';
import AddCustomerModel from '../components/Customers/AddCustomerModel';

const Customers = () => {
  const [customers,      setCustomers      ] = useState<Row[]>([]);
  const [customerAmount, setCustomerAmount ] = useState(0);
  const [addingCustomer, setAddingCustomer ] = useState(false);

  const getCustomers = async () => {
    const response = await api.get('customers', {
      params: { page: '1', limit: '10', status: '' }
    });

    if (response.data) {
      setCustomers(response.data.data);
      setCustomerAmount(response.data.totalItems);
    } else {
      return;
    }
  }

  useEffect(() => {
    getCustomers();
  }, [])

  const handleClose = () => {
    setAddingCustomer(false);
  }

  const onCustomerAdded = (newCustomer: Partial<Customer>) => {
    setCustomers([...customers, newCustomer]);
    setCustomerAmount(prev => prev + 1);
  }

  const columns: Column[] = [
    {
      key: 'customerNumber',
      label: 'Num. Cliente'
    },
    {
      key: 'name',
      label: 'Nombre'
    },
    {
      key: 'fiscalData',
      label: 'Datos Fiscales'
    },
    {
      key: 'address',
      label: 'Dirección'
    },
    {
      key: 'phone',
      label: 'Teléfono'
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
    <div className="main customers">
      <div className="content">
        <div className="centered">
          <div className="top-table">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4'>Clientes - </Typography>
              <Typography
                variant='h4'
                sx={{ marginLeft: 1, color: '#AEACAC' }}
              >
                {customerAmount}
              </Typography>
            </div>
            <Button
              variant='contained'
              onClick={() => setAddingCustomer(true)}
            >
              Agregar Cliente
            </Button>
          </div>
          <GenericTable columns={columns} data={customers}/>
          <AddCustomerModel 
            open={addingCustomer}
            onClose={handleClose}
            onCustomerAdded={onCustomerAdded}
          />
        </div>
      </div>
    </div>
  )
}

export default Customers;