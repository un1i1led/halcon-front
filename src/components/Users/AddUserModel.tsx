import { Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { User } from "../../types/User";
import * as yup from 'yup';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../services/api";
import { useEffect } from "react";

interface AddUserModelProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (newUser: Partial<User>) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales' | 'purchasing' | 'warehouse' | 'route';
}

const AddUserModel = ({ open, onClose, onUserAdded }: AddUserModelProps) => {
  const schema = yup.object({
    name: yup
      .string()
      .required('Nombre es requerido'),
    email: yup
      .string()
      .email('Debe ser un correo válido')
      .required('Correo es requerido'),
    password: yup
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('Contraseña es requerida'),
    role: yup
      .string()
      .oneOf(['admin', 'sales', 'purchasing', 'warehouse', 'route'], 'Rol inválido')
      .required('Rol es requerido')
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '' as FormData['role'],
    },
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const response = await api.post('auth/register', data);
      onUserAdded(response.data);
      onClose();
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Agregar Usuario</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            id='user-name'
            label='Nombre'
            placeholder='Juan Pedro'
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            margin='normal'
          />
          <TextField
            fullWidth
            id='user-email'
            label='Correo'
            placeholder='juanpedro@halcon.com'
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin='normal'
          />
          <TextField
            fullWidth
            id='user-password'
            label='Contraseña'
            type='password'
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin='normal'
          />
          <FormControl fullWidth margin="normal" error={!!errors.role}>
            <InputLabel id="user-role">Rol</InputLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="user-role"
                  id="user-role-select"
                  label="Rol"
                  {...field}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="purchasing">Purchasing</MenuItem>
                  <MenuItem value="warehouse">Warehouse</MenuItem>
                  <MenuItem value="route">Route</MenuItem>
                </Select>
              )}
            />
            {errors.role && <p style={{ color: 'red' }}>{errors.role.message}</p>}
          </FormControl>
          <Button 
            type="submit"
            sx={{ marginY: '1rem' }}
          >
            Agregar Usuario
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModel;
