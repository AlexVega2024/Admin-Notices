import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Alert,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { IGallery, INotice } from "../../interfaces/Notice.interface";
import { ImageComponent } from "./ImageComponent";
import { urlBase } from "../../assets";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/features/snackbarSlice";

interface DialogEditGalleryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gallery: IGallery; // Galería a editar
}

const DialogEditGallery: React.FC<DialogEditGalleryProps> = ({
  open,
  onClose,
  onSuccess,
  gallery,
}) => {
  const dispatch = useDispatch();
  const [listNoticies, setListNoticies] = useState<INotice[]>([]);
  const [editGallery, setEditGallery] = useState<IGallery>({
    ...gallery,
    id_notice: gallery.id_notice !== 0 ? gallery.id_notice : -1,
  });
  const [error, setError] = useState<string | null>(null);
  const [newFileImg, setNewFileImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleNoticies = async () => {
      try {
        const noticies = await fetchApiNodeNoticies("GET", "get-noticies");
        setListNoticies(noticies.data);
      } catch (error) {
        console.error("Error fetching noticies:", error);
        setListNoticies([]);
      }
    };
    handleNoticies();
  }, []);

  useEffect(() => {
    if (editGallery.id_notice === -1 && listNoticies.length > 0) {
      setEditGallery({
        ...editGallery,
        id_notice: listNoticies[0].id_notice,
      });
    }
  }, [listNoticies]);

  const handleNoticieChange = (event: SelectChangeEvent<number>) => {
    setEditGallery({
      ...editGallery,
      id_notice: event.target.value as number,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setNewFileImg(URL.createObjectURL(file));
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
      ) {
        setEditGallery((prevGallery) => ({
          ...prevGallery,
          [imageType]: file,
        }));
        setError(null); 
      } else {
        setError("Formato de imagen no soportado.");
      }
    }
  };

  const validateForm = () => {
    if (!editGallery.id_notice || editGallery.id_notice === -1) {
      return "Debe seleccionar una noticia.";
    }
    if (!editGallery.name_image) {
      return "Debe cargar una imagen.";
    }
    return null;
  };

  const handleSubmit = async () => {
    // console.log("Datos editados: ", editGallery);
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id_gallery", editGallery.id_gallery.toString());
      formData.append("id_notice", editGallery.id_notice!.toString());
      formData.append("name_image", editGallery.name_image);
      const params = { name_img: editGallery.name_image }
      const response = await fetchApiNodeNoticies("POST", "update-gallery", params);
      if (response.success) {
        onSuccess();
        onClose();
        dispatch(openSnackbar({ message: response.message, severity: 'success' }));
      }
    } catch (error) {
      dispatch(openSnackbar({ message: "Error al actualizar la imagen en la galería.", severity: 'error' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Galería</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel id="noticie-label">Elija una noticia</InputLabel>
                <Select
                  labelId="noticie-label"
                  id="noticie-select"
                  value={editGallery.id_notice || 0}
                  onChange={handleNoticieChange}
                  label="Noticia"
                >
                  {listNoticies.length > 0 ? (
                    listNoticies.map((noticie: INotice) => (
                      <MenuItem
                        key={noticie.id_notice}
                        value={noticie.id_notice}
                      >
                        {noticie.title}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No hay noticias disponibles
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" alignContent="center">
                <ImageComponent
                  urlImage={newFileImg   || `${urlBase}${editGallery.name_image}`}
                  typeImage="img-gallery"
                  name={editGallery.name_image}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="img_gallery_input" className="my-2 fw-bold">Cargar nueva imagen:</label>
              <input
                id="img_gallery_input"
                className="form-control"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "name_image")}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditGallery;
