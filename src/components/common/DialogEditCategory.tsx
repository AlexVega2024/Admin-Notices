import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { ICategory } from "../../interfaces/Notice.interface";

interface DialogEditCategoryProps {
  open: boolean;
  onClose: () => void;
  category: ICategory | null;
  onSuccess: () => void;
}

const DialogEditCategory: React.FC<DialogEditCategoryProps> = ({ open, onClose, category, onSuccess }) => {
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
        await fetchApiNodeNoticies("POST", "update-category", params);
        onSuccess();
        onClose();
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Categoría</DialogTitle>
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
