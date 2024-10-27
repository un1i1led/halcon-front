import { Button, TextField, Typography } from '@mui/material';
import '../styles/Login.css';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate])

  const schema = yup.object({
    email: yup
      .string()
      .email()
      .required(),
    password: yup
      .string()
      .required()
  })

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const response = await api.post('auth/login', data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
      return;
    } catch {
      return;
    }
  }

  return (
    <div className='login'>
      <div className="modal">
        <Typography 
        variant='h5'
        color='primary'
        sx={{ marginY: '1rem' }}
        >
          Ingresa a tu cuenta
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            id='email'
            label='Correo'
            type='text'
            placeholder='tucorreo@correo.com'
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin='normal'
          />
          <TextField
            fullWidth
            id='password'
            label='Contraseña'
            type='password'
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin='normal'
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ marginY: '1rem' }}
          >
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login;