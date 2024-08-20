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
import { ImageComponent } from "./ImageComponent";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/features/snackbarSlice";
import { urlBase } from "../../assets";

interface EditNoticeModalProps {
  open: boolean;
  onClose: () => void;
  notice: INotice | null;
  onSuccess: () => void;
}

const DialogEditNoticies = ({
  open,
  onClose,
  notice,
  onSuccess,
}: EditNoticeModalProps) => {
  const dispatch = useDispatch();
  const [editedNotice, setEditedNotice] = useState<INotice>({
    id_category: 0,
    id_notice: 0,
    img_card: "",
    img_banner: "",
    title: "",
    description: "",
    state_notice: 1,
  });
  const [newFileImgCard, setNewFileImgCard] = useState<string | undefined>(undefined);
  const [newFileImgBanner, setNewFileImgBanner] = useState<string | undefined>(undefined);

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

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "img_card" | "img_banner"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      if (imageType === "img_card") {
        setNewFileImgCard(fileURL);
      } else {
        setNewFileImgBanner(fileURL);
      }
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
      ) {
        setEditedNotice((prevNotice) => ({
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
      formData.append('img_card', editedNotice.img_card);
      formData.append('img_banner', editedNotice.img_banner!);
      formData.append('title', editedNotice.title);
      formData.append('description', editedNotice.description);
      formData.append('id_category', editedNotice.id_category!.toString());
      formData.append('id_notice', editedNotice.id_notice.toString());

      const updateNotice = await fetchApiNodeNoticies("POST", "update-noticie", formData);
      if (updateNotice.success) {
        onSuccess();
        onClose();
        dispatch(openSnackbar({ message: updateNotice.message, severity: 'success' }));
      } else {
        dispatch(openSnackbar({ message: updateNotice.message, severity: 'error' }));
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold"}}>Editar Noticia</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label htmlFor="img_card_input" className="my-2 fw-bold">Imagen del Card:</label>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                my={1}
              >
                <ImageComponent
                  urlImage={newFileImgCard || `${urlBase}${editedNotice.img_card}`}
                  typeImage="img-card"
                  name={editedNotice.img_card}
                />
              </Box>
              <input
                id="img_card_input"
                className="form-control"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e, "img_card")}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="img_banner_input" className="my-2 fw-bold">Imagen del Banner:</label>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                my={1}
              >
                <ImageComponent
                  urlImage={newFileImgBanner || `${urlBase}${editedNotice.img_banner}`}
                  typeImage="img-banner"
                  name={editedNotice.img_banner!}
                />
              </Box>
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
                variant="outlined"
                value={editedNotice.title || ""}
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
                value={editedNotice.description || ""}
                onChange={handleChange}
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditNoticies;
