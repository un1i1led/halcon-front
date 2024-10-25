import { CircularProgress, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { default as BasicTable } from '@mui/material/Table';
import { Row, Column } from '../types/TableTypes';

interface GenerictableProps {
  columns: Column[];
  data: Row[];
  onRowClick?: (row: Row) => void;
  loading?: boolean;
}

const GenericTable = ({ columns, data, onRowClick, loading}: GenerictableProps) => {
  const dataIsEmpty = !data || data.length === 0;

  return (
    <div className="table">
      <TableContainer component={Paper}>
        <BasicTable sx={{ minWidth: 650 }} aria-label='table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align='left' sx={{ color: '#2f2f2f', fontWeight: 'bold' }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  <CircularProgress/>
                </TableCell>
              </TableRow>
            ): dataIsEmpty ? (
              <TableRow>
                <TableCell align='center'>
                  No hay datos
                </TableCell>
              </TableRow>
            ): (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover' 
                    },
                    transition: 'background-color 0.3s', 
                  }}
                  onClick={() => onRowClick && onRowClick(row)}
                  className='table-item'
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} align='left'>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </BasicTable>
      </TableContainer>
    </div>
  )
}

export default GenericTable;