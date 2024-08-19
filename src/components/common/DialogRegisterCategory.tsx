import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useState } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";

interface DialogRegisterCategoryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DialogRegisterCategory: React.FC<DialogRegisterCategoryProps> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");

  const handleRegister = async () => {
    try {
      const params = {name: name}
      await fetchApiNodeNoticies("POST", "register-category", params);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error registrando categoría:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Categoría</DialogTitle>
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
        <Button onClick={handleRegister}>Registrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRegisterCategory;
