import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import { INotice } from "../../interfaces/Notice.interface";
import { ImageComponent } from "./ImageComponent";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/features/snackbarSlice";
import { assets, urlBase } from "../../assets";

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
  const [newFileImgCard, setNewFileImgCard] = useState<string | undefined>(
    undefined
  );
  const [newFileImgBanner, setNewFileImgBanner] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null); // Estado para los errores
  const fileInputCardRef = useRef<HTMLInputElement | null>(null);
  const fileInputBannerRef = useRef<HTMLInputElement | null>(null);

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
        const fileURL = URL.createObjectURL(file);
        if (imageType === "img_card") {
          setNewFileImgCard(fileURL);
        } else {
          setNewFileImgBanner(fileURL);
        }
        setEditedNotice((prevNotice) => ({
          ...prevNotice,
          [imageType]: file,
        }));
        setError(null);
      } else {
        setError(
          "Formato de imagen no soportado. Solo se permiten jpg, jpeg, png, gif, webp, svg."
        );
      }
    }
  };

  const handleClikImage = (imageType: string) => {
    if (imageType === "card") {
      if (fileInputCardRef.current) {
        fileInputCardRef.current.click();
      }
    } else {
      if (fileInputBannerRef.current) {
        fileInputBannerRef.current.click();
      }
    }
  };

  // Validar campos antes de enviar el formulario
  const validateForm = () => {
    if (!editedNotice.title) {
      return "El título es obligatorio.";
    }
    if (!editedNotice.description) {
      return "La descripción es obligatoria.";
    }
    if (!editedNotice.img_card) {
      return "Debe cargar una imagen para el card.";
    }
    if (!editedNotice.img_banner) {
      return "Debe cargar una imagen para el banner.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("img_card", editedNotice.img_card);
      formData.append("img_banner", editedNotice.img_banner!);
      formData.append("title", editedNotice.title);
      formData.append("description", editedNotice.description);
      formData.append("id_category", editedNotice.id_category!.toString());
      formData.append("id_notice", editedNotice.id_notice.toString());

      const updateNotice = await fetchApiNodeNoticies(
        "POST",
        "update-noticie",
        formData
      );
      if (updateNotice.success) {
        onSuccess();
        onClose();
        dispatch(
          openSnackbar({ message: updateNotice.message, severity: "success" })
        );
      } else {
        dispatch(
          openSnackbar({ message: updateNotice.message, severity: "error" })
        );
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
      dispatch(
        openSnackbar({
          message: "Error en la actualización de la noticia.",
          severity: "error",
        })
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Editar Noticia</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}
        <Box sx={{ width: 500 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <label htmlFor="img_card_input" className="my-2 fw-bold">
                Imagen del Card:
              </label>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                onClick={() => handleClikImage("card")}
                my={1}
                sx={{ cursor: "pointer" }}
              >
                <ImageComponent
                  urlImage={
                    newFileImgCard || `${urlBase}${editedNotice.img_card}`
                  }
                  typeImage="img-card"
                  name={editedNotice.img_card.toString()}
                />
              </Box>
              <input
                id="img_card_input"
                ref={fileInputCardRef}
                className="form-control"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageSelect(e, "img_card")}
              />
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="img_banner_input" className="my-2 fw-bold">
                Imagen del Banner:
              </label>
              <Box
                display="flex"
                justifyContent="center"
                alignContent="center"
                onClick={() => handleClikImage("banner")}
                my={1}
                sx={{ cursor: "pointer" }}
              >
                <ImageComponent
                  urlImage={
                    newFileImgBanner || `${urlBase}${editedNotice.img_banner}`
                  }
                  typeImage="img-banner"
                  name={editedNotice.img_banner?.toString() || ""}
                />
              </Box>
              <input
                id="img_banner_input"
                ref={fileInputBannerRef}
                className="form-control"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
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
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditNoticies;
