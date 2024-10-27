import { SubmitHandler, useForm } from "react-hook-form";
import { Customer } from "../../types/Customer";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import api from "../../services/api";

interface AddCustomerModelProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: (newCustomer: Partial<Customer>) => void;
}

interface FormData {
  name: string;
  fiscalData: string;
  address: string;
  phone: string;
}

const AddCustomerModel = ({ open, onClose, onCustomerAdded }: AddCustomerModelProps) => {
  const schema = yup.object({
    name: yup
      .string()
      .required('Nombre es requerido'),
    fiscalData: yup
      .string()
      .required('Los datos fiscales son requeridos'),
    address: yup
      .string()
      .required('La dirección es requerido'),
    phone: yup
      .string()
      .length(10, 'Debe ser 10 digitos')
      .required('El teléfono es requerido')
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      fiscalData: '',
      address: '',
      phone: '',
    },
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    data.phone = `+52${data.phone.replace(/\s/g, '')}`

    try {
      const response = await api.post('customers', data);
      onCustomerAdded(response.data);
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
      <DialogTitle>Agregar Cliente</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
              fullWidth
              id='client-name'
              label='Nombre'
              placeholder='Abarrotes San Miguel'
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin='normal'
            />
            <TextField
              fullWidth
              id='fiscal-data'
              label='Datos Fiscales'
              placeholder='12361372'
              {...register('fiscalData')}
              error={!!errors.fiscalData}
              helperText={errors.fiscalData?.message}
              margin='normal'
            />
            <TextField
              fullWidth
              id='client-address'
              label='Dirección'
              placeholder='123 Avenida Galaxia, Gdl, Jal.'
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
              margin='normal'
            />
            <TextField
              fullWidth
              id='client-phone'
              label='Teléfono'
              placeholder='6678124417'
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              margin='normal'
            />
            <Button
              type='submit'
              sx={{ marginY: '1rem' }}
            >
              Agregar Cliente
            </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCustomerModel;