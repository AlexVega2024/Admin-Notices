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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent
} from "@mui/material";
import { ICategory, INotice } from "../../interfaces/Notice.interface";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { formatDateTime } from "../../helpers/formatDate";
import AlertComponent from "./AlertComponent";

interface RegisterNoticeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DialogRegisterNoticies: React.FC<RegisterNoticeModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [listCategories, setListCategories] = useState<ICategory[]>([]);
  const [newNotice, setNewNotice] = useState<INotice>({
    id_category: 0,
    id_notice: 0,
    img_card: '',
    img_banner: '',
    title: '',
    description: '',
    date_time: '',
    state_notice: 1,
  });

  useEffect(() => {
    const handleCategories = async () => {
      try {
        const categories = await fetchApiNodeNoticies("GET", "get-categories");
        setListCategories(categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setListCategories([]);
      }
    };
    handleCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewNotice({
      ...newNotice,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setNewNotice({
      ...newNotice,
      id_category: event.target.value as number,
    });
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "img_card" | "img_banner"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
      ) {
        setNewNotice((prevNotice) => ({
          ...prevNotice,
          [imageType]: file,
        }));
      } else {
        console.error("Formato de imagen no soportado");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('id_category', newNotice.id_category!.toString());
      formData.append('img_banner', newNotice.img_banner!);
      formData.append('img_card', newNotice.img_card!);
      formData.append('title', newNotice.title);
      formData.append('description', newNotice.description);
      formData.append('date_time', newNotice.date_time!);
      formData.append('state_notice', newNotice.state_notice!.toString());
  
      await fetchApiNodeNoticies("POST", "register-notice", formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Nueva Noticia</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel id="category-label">Elija una categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  name="id_category"
                  value={newNotice.id_category || ''}
                  onChange={handleCategoryChange}
                  label="Categoría"
                >
                  {listCategories.map((category) => (
                    <MenuItem key={category.id_category} value={category.id_category}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="img_card_input">Imagen del Card</label>
              <input
                id="img_card_input"
                className="form-control" 
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, "img_card")}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="img_banner_input">Imagen del Banner</label>
              <input
                id="img_banner_input"
                className="form-control"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, "img_banner")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Título"
                name="title"
                fullWidth
                variant="filled"
                value={newNotice.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="description"
                fullWidth
                variant="filled"
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
                variant="filled"
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
