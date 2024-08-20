import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { ICategory } from "../../interfaces/Notice.interface";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/features/snackbarSlice";

interface DialogEditCategoryProps {
  open: boolean;
  onClose: () => void;
  category: ICategory | null;
  onSuccess: () => void;
}

const DialogEditCategory: React.FC<DialogEditCategoryProps> = ({ open, onClose, category, onSuccess }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleUpdate = async () => {
    if (category) {
      try {
        const params = { name: name, id_category: category.id_category};
        const response = await fetchApiNodeNoticies("POST", "update-category", params);
        if (response.success) {
          onSuccess();
          onClose();
          dispatch(openSnackbar({ message: response.message, severity: 'success' }));
        } else {
          dispatch(openSnackbar({ message: response.message, severity: 'error' }));
        }
      } catch (error) {
        console.error("Error al actualizar la categoria:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold"}}>Editar Categoría</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nombre de la Categoría"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleUpdate}>Actualizar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditCategory;
