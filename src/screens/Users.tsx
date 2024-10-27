import { Button, Typography } from '@mui/material';
import { Column, Row } from '../types/TableTypes';
import { useEffect, useState } from 'react';
import { User } from '../types/User';
import GenericTable from '../components/GenericTable';
import api from '../services/api';
import AddUserModel from '../components/Users/AddUserModel';

const Users = () => {
  const [users,      setUsers      ] = useState<Row[]>([]);
  const [userAmount, setUserAmount ] = useState(0);
  const [addingUser, setAddingUser ] = useState(false);

  const getUsers = async () => {
    const response = await api.get('users', {
      params: { page: '1', limit: '10', status: '' }
    });

    if (response.data) {
      setUsers(response.data.data);
      setUserAmount(response.data.totalItems);
    } else {
      return;
    }
  }

  useEffect(() => {
    getUsers();
  }, [])

  const handleClose = () => {
    setAddingUser(false);
  }

  const onUserAdded = (newUser: Partial<User>) => {
    setUsers([...users, newUser]);
    setUserAmount(prev => prev + 1);
  }

  const columns: Column[] = [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'name',
      label: 'Nombre'
    },
    {
      key: 'email',
      label: 'Correo'
    },
    {
      key: 'role',
      label: 'Role'
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
    <div className='main users'>
      <div className='content'>
        <div className='centered'>
          <div className='top-table'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4'>Usuarios - </Typography>
              <Typography
                variant='h4'
                sx={{ marginLeft: 1, color: '#AEACAC' }}
              >
                {userAmount}
              </Typography>
            </div>
            <Button
              variant='contained'
              onClick={() => setAddingUser(true)}
            >
              Agregar Usuario
            </Button>
          </div>
          <GenericTable columns={columns} data={users}/>
          <AddUserModel
            open={addingUser}
            onClose={handleClose}
            onUserAdded={onUserAdded}
          />
        </div>
      </div>
    </div>
  )
}

export default Users;