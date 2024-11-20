import { Row } from '../../types/TableTypes'
import { getUserData } from '../../utils/getUserData';

interface ModalProps {
  open: boolean;
  data: Row;
  onClose: () => void;
}

const UpdateOrderModal = ({ open, data, onClose }: ModalProps) => {
  const user = getUserData();

  
}

export default UpdateOrderModal;