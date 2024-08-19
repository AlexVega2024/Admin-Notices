import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";

interface DialogRegisterCategoryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DialogRegisterCategory: React.FC<DialogRegisterCategoryProps> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateName = (name: string) => {
    if (name.trim() === "") {
      return "El nombre de la categoría es obligatorio.";
    }
    if (name.length < 3) {
      return "El nombre debe tener al menos 3 caracteres.";
    }
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError(null); // Limpiar errores previos
      const params = { name };
      const response = await fetchApiNodeNoticies("POST", "register-category", params);

      if (response.success) {
        alert(response.message);
        onSuccess();
        onClose();
      } else {
        console.log(response.data);
        alert(response.message);
      }
    } catch (error) {
      console.error("Error registrando categoría:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registrar Categoría</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        )}
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
          helperText={error}
          error={!!error}
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
