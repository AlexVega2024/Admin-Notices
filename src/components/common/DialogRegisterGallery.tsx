import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { IGallery, INotice } from "../../interfaces/Notice.interface";

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
  const [listNoticies, setListNoticies] = useState<INotice[]>([]);
  const [newGallery, setNewGallery] = useState<IGallery>({
    id_gallery: 0,
    id_notice: 0,
    name_image: "",
    state_image: 1,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleNoticies = async () => {
      try {
        const noticies = await fetchApiNodeNoticies("GET", "get-noticies");
        setListNoticies(noticies || []);
      } catch (error) {
        console.error("Error fetching noticies:", error);
        setListNoticies([]);
      }
    };
    handleNoticies();
  }, []);

  const validateName = (name: string) => {
    if (name.trim() === "") {
      return "El nombre de la galería es obligatorio.";
    }
    if (name.length < 3) {
      return "El nombre debe tener al menos 3 caracteres.";
    }
    return null;
  };

  const handleNoticieChange = (event: SelectChangeEvent<number>) => {
    setNewGallery({
      ...newGallery,
      id_notice: event.target.value as number,
    });
  };

  const handleMultipleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: string
  ) => {
    const files = e.target.files;
    console.log("file: ", files);
    if (files && files.length > 0) {
      const file = files[0];
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
      ) {
        setNewGallery((prevGallery) => ({
          ...prevGallery,
          [imageType]: file
        }));
      } else {
        console.error("Formato de imagen no soportado");
      }
    }
  };

  const handleSubmit = async () => {

    try {
      const formData = new FormData();
      formData.append('id_notice', newGallery.id_notice!.toString());
      formData.append('name_image', newGallery.name_image);
      await fetchApiNodeNoticies("POST", "register-gallery", formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Galería</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="filled"
              >
                <InputLabel id="noticie-label">Elija una noticia</InputLabel>
                <Select
                  labelId="noticie-label"
                  id="noticie-select"
                  name="id_noticie"
                  value={newGallery.id_notice || ""}
                  onChange={handleNoticieChange}
                  label="Noticia"
                >
                  {listNoticies.map((noticie: INotice) => (
                    <MenuItem
                      key={noticie.id_notice}
                      value={noticie.id_notice}
                    >
                      {noticie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="img_card_input" className="my-2">Carga una o varias imágenes:</label>
              <input
                id="img_card_input"
                className="form-control"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleImageSelect(e, "name_image")}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>Registrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRegisterGallery;
