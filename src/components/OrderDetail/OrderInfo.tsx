import { ReactNode } from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { Order } from '../../types/Order';

// TODO: Add image handling

interface OrderInfoProps {
  order: Order;
}

const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <Box sx={{ display: 'flex', mb: 1 }}>
    <Typography
      variant="subtitle2"
      sx={{ width: '150px', fontWeight: 'bold', flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography>{value}</Typography>
  </Box>
);

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Details
      </Typography>
      <Stack spacing={1}>
        <InfoRow label="Order ID:" value={order.id} />
        <InfoRow label="Status:" value={order.status} />
        <InfoRow label="Delivery Address:" value={order.deliveryAddress} />
        <InfoRow label="Customer Number:" value={order.customerNumber} />
        <InfoRow label="Notes:" value={order.notes} />
        <InfoRow
          label="Creado:"
          value={new Date(order.createdAt).toLocaleString()}
        />
        <InfoRow
          label="Actualizado:"
          value={new Date(order.updatedAt).toLocaleString()}
        />
      </Stack>
    </Paper>
  );
};

export default OrderInfo;
