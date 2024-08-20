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
import { assets, urlBase } from "../../assets";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";

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
  const [editedNotice, setEditedNotice] = useState<INotice>({
    id_category: 0,
    id_notice: 0,
    img_card: "",
    img_banner: "",
    title: "",
    description: "",
    state_notice: 1,
  });

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
      formData.append('img_banner', editedNotice?.img_banner!);
      formData.append('img_card', editedNotice?.img_card!);
      formData.append('title', editedNotice?.title!);
      formData.append('description', editedNotice?.description!);
      formData.append('id_category', (editedNotice.id_category ?? 0).toString());
      formData.append('id_notice', editedNotice?.id_notice?.toString());

      await fetchApiNodeNoticies("POST", "update-noticie", formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Noticia</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label htmlFor="img_card_input">Imagen del Card</label>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                my={1}
              >
                <ImageComponent
                  urlImage={
                    editedNotice?.img_card
                      ? `${urlBase}${editedNotice?.img_card}`
                      : assets.svg.emptySvg
                  }
                  typeImage="img-card"
                  name={editedNotice?.img_card!}
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
              <label htmlFor="img_banner_input">Imagen del Banner</label>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                my={1}
              >
                <ImageComponent
                  urlImage={
                    editedNotice?.img_card
                      ? `${urlBase}${editedNotice?.img_banner}`
                      : assets.svg.emptySvg
                  }
                  typeImage="img-banner"
                  name={editedNotice?.img_banner!}
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
