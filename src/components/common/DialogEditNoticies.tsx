import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { INotice } from "../../interfaces/Notice.interface";

interface EditNoticeModalProps {
  open: boolean;
  onClose: () => void;
  notice: INotice | null;
  onSuccess: () => void;
}

const DialogEditNoticies= ({
  open,
  onClose,
  notice,
  onSuccess,
}: EditNoticeModalProps) => {
  const [editedNotice, setEditedNotice] = useState<INotice | null>(null);

  useEffect(() => {
    if (notice) {
      setEditedNotice(notice);
    }
  }, [notice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedNotice) {
      setEditedNotice({
        ...editedNotice,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async () => {
    if (editedNotice) {
      try {
        // await updateNotice(editedNotice.id_notice, editedNotice);
        onSuccess(); // Notifica al componente padre del éxito
        onClose(); // Cierra el modal
      } catch (error) {
        console.error("Error updating notice:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Noticia</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <input id="nuestroinput" className="upload ml-5" type="file" accept="image/*"
                        onChange={handleChange} />
              {/* <TextField
                label="Imagen Card"
                name="img_card"
                fullWidth
                variant="outlined"
                value={editedNotice?.img_card || ""}
                onChange={handleChange}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Imagen Banner"
                name="img_banner"
                fullWidth
                variant="outlined"
                value={editedNotice?.img_banner || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Título"
                name="title"
                fullWidth
                variant="outlined"
                value={editedNotice?.title || ""}
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
                value={editedNotice?.description || ""}
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditNoticies;
