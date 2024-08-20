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
  SelectChangeEvent,
  FormHelperText
} from "@mui/material";
import { ICategory, INotice } from "../../interfaces/Notice.interface";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";

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
    state_notice: 1,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newNotice.title) newErrors.title = "El título es obligatorio.";
    if (!newNotice.description) newErrors.description = "La descripción es obligatoria.";
    if (!newNotice.id_category) newErrors.id_category = "Debe seleccionar una categoría.";
    
    // Validación para archivos
    if (!newNotice.img_card) newErrors.img_card = "Debe cargar una imagen para el card.";
    if (!newNotice.img_banner) newErrors.img_banner = "Debe cargar una imagen para el banner.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewNotice({
      ...newNotice,
      [e.target.name]: e.target.value,
    });

    // Limpiar error cuando el usuario empieza a llenar el campo
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setNewNotice({
      ...newNotice,
      id_category: event.target.value as number,
    });

    // Limpiar error cuando el usuario selecciona una categoría
    if (errors.id_category) {
      setErrors({
        ...errors,
        id_category: "",
      });
    }
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

        // Limpiar error cuando el usuario selecciona una imagen válida
        if (errors[imageType]) {
          setErrors({
            ...errors,
            [imageType]: "",
          });
        }
      } else {
        setErrors({
          ...errors,
          [imageType]: "Formato de imagen no soportado.",
        });
        console.error("Formato de imagen no soportado");
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_category', newNotice.id_category!.toString());
      if (newNotice.img_banner) formData.append('img_banner', newNotice.img_banner);
      if (newNotice.img_card) formData.append('img_card', newNotice.img_card);
      formData.append('title', newNotice.title);
      formData.append('description', newNotice.description);
      formData.append('state_notice', newNotice.state_notice!.toString());
  
      const response = await fetchApiNodeNoticies("POST", "register-notice", formData);
      if (response.success) {
        alert(response.message);
        onSuccess();
        onClose();
      } else {
        console.log(response.data);
        alert(response.message);
      }
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
              <FormControl
                fullWidth
                variant="filled"
                error={!!errors.id_category}
              >
                <InputLabel id="category-label">Elija una categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  name="id_category"
                  value={newNotice.id_category || ""}
                  onChange={handleCategoryChange}
                  label="Categoría"
                >
                  {listCategories.map((category) => (
                    <MenuItem
                      key={category.id_category}
                      value={category.id_category}
                    >
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.id_category && (
                  <FormHelperText>{errors.id_category}</FormHelperText>
                )}
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
              {errors.img_card && (
                <FormHelperText error>{errors.img_card}</FormHelperText>
              )}
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
              {errors.img_banner && (
                <FormHelperText error>{errors.img_banner}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Título"
                name="title"
                fullWidth
                variant="filled"
                value={newNotice.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
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
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRegisterNoticies;
