import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Link,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import type { VehicleDocumentResponse } from '../../types/fleet';

interface VehicleDocumentTableProps {
  documents: VehicleDocumentResponse[];
  onDelete: (id: number) => void;
  onEdit: (doc: VehicleDocumentResponse) => void;
  canModify: boolean;
}

export const VehicleDocumentTable: React.FC<VehicleDocumentTableProps> = ({
  documents,
  onDelete,
  onEdit,
  canModify
}) => {
  const isExpired = (expiryDateStr: string) => {
    return new Date(expiryDateStr) < new Date();
  };

  const isExpiringSoon = (expiryDateStr: string) => {
    const expiry = new Date(expiryDateStr);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  if (documents.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
        No documents uploaded for this vehicle.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Document Type / Name</TableCell>
            <TableCell>Document Number</TableCell>
            <TableCell>Expiry Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">File</TableCell>
            {canModify && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => {
            const expired = isExpired(doc.expiryDate);
            const warning = isExpiringSoon(doc.expiryDate);
            
            return (
              <TableRow key={doc.id}>
                <TableCell sx={{ fontWeight: 'medium' }}>{doc.name}</TableCell>
                <TableCell>{doc.documentNumber}</TableCell>
                <TableCell>{doc.expiryDate}</TableCell>
                <TableCell>
                  {expired ? (
                    <Chip label="Expired" color="error" size="small" />
                  ) : warning ? (
                    <Chip label="Expiring Soon" color="warning" size="small" />
                  ) : (
                    <Chip label="Active" color="success" size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Link href={doc.filePath} target="_blank" rel="noopener noreferrer">
                    <Tooltip title="View Document File">
                      <IconButton size="small" color="primary">
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </TableCell>
                {canModify && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Replace / Edit Document">
                        <IconButton size="small" onClick={() => onEdit(doc)} color="secondary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Document">
                        <IconButton size="small" onClick={() => onDelete(doc.id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
