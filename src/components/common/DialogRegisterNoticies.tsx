// src/components/RegisterNoticeModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Grid } from '@mui/material';
import { INotice } from '../../interfaces/Notice.interface';

interface RegisterNoticeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DialogRegisterNoticies: React.FC<RegisterNoticeModalProps> = ({ open, onClose, onSuccess }) => {
  const [newNotice, setNewNotice] = useState<INotice>({
    id_notice: 0,
    img_card: '',
    img_banner: '',
    title: '',
    description: '',
    date_time: '',
    state_notice: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNotice({
      ...newNotice,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      console.log(newNotice);
      // await createNotice(newNotice);
      onSuccess(); 
      onClose(); 
    } catch (error) {
      console.error("Error creating notice:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Nueva Noticia</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Imagen Card"
                name="img_card"
                fullWidth
                variant="outlined"
                value={newNotice.img_card}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Imagen Banner"
                name="img_banner"
                fullWidth
                variant="outlined"
                value={newNotice.img_banner}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Título"
                name="title"
                fullWidth
                variant="outlined"
                value={newNotice.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="description"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={newNotice.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha y Hora"
                name="date_time"
                fullWidth
                variant="outlined"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={newNotice.date_time}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRegisterNoticies;
