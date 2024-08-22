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
import { useEffect, useState, useRef } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { IGallery, INotice } from "../../interfaces/Notice.interface";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/features/snackbarSlice";
import { ImageComponent } from "./ImageComponent";
import { assets } from "../../assets";

interface DialogRegisterGalleryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DialogRegisterGallery: React.FC<DialogRegisterGalleryProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [listNoticies, setListNoticies] = useState<INotice[]>([]);
  const [newGallery, setNewGallery] = useState<IGallery>({
    id_gallery: 0,
    id_notice: 0,
    name_image: "",
    state_image: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [newFileImg, setNewFileImg] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Función para generar UUID
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Función para manejar el cambio en la lista de noticias
  const handleNoticies = async () => {
    try {
      const noticies = await fetchApiNodeNoticies("GET", "get-noticies");
      if (noticies.success) {
        setListNoticies(noticies.data);
      }
    } catch (error) {
      setListNoticies([]);
      dispatch(openSnackbar({ message: "Error al listar las noticias en el select.", severity: 'error' }));
    }
  };

  useEffect(() => {
    setNewGallery({
      id_gallery: 0,
      id_notice: 0,
      name_image: "",
      state_image: 1,
    });
    setError(null);
    setNewFileImg(undefined);
    handleNoticies();
  }, [open]);

  // Validar el formulario
  const validateForm = () => {
    if (!newGallery.id_notice) {
      return "Debe seleccionar una noticia.";
    }
    if (!newGallery.name_image) {
      return "Debe cargar al menos una imagen.";
    }
    return null;
  };

  // Manejar el cambio en la selección de noticias
  const handleNoticieChange = (event: SelectChangeEvent<number>) => {
    setNewGallery({
      ...newGallery,
      id_notice: event.target.value as number,
    });
    setError(null); // Limpiar el error cuando se seleccione una noticia
  };

  // Manejar la selección de imagen
  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "name_image"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
        setNewFileImg(URL.createObjectURL(file));
        setNewGallery((prevGallery) => ({
          ...prevGallery,
          [imageType]: file
        }));
        setError(null);
      } else {
        setError("Formato de imagen no soportado. Solo se permiten jpg, jpeg, png, gif, webp, svg.");
      }
    }
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("id_notice", newGallery.id_notice!.toString());
      formData.append("name_image", newGallery.name_image);
  
      const registerGallery = await fetchApiNodeNoticies("POST", "register-gallery", formData);
      if (registerGallery.success) {
        onSuccess();
        onClose();
        dispatch(openSnackbar({ message: registerGallery.message, severity: 'success' }));
      }
    } catch (error) {
      dispatch(openSnackbar({ message: "Error al registrar la imagen en la galería.", severity: 'error' }));
    }
  };  

  // Manejar el clic en la imagen para abrir el selector de archivos
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Registrar Galería</DialogTitle>
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
                  name="id_noticie"
                  value={newGallery.id_notice}
                  onChange={handleNoticieChange}
                  label="Noticia"
                >
                  {listNoticies.map((noticie: INotice) => (
                    <MenuItem key={noticie.id_notice} value={noticie.id_notice}>
                      {noticie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="img_card_input" className="my-2 fw-bold">
                Carga una imagen:
              </label>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                my={1}
                onClick={handleImageClick}
                sx={{
                  cursor: 'pointer'
                }}
              >
                <ImageComponent
                  urlImage={newFileImg || assets.images.uploadImage}
                  typeImage="img-card"
                  name={newGallery.name_image.toString()}
                  border
                />
              </Box>
              <input
                id="img_card_input"
                ref={fileInputRef}
                className="form-control"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleImageSelect(e, "name_image")}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Registrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRegisterGallery;
