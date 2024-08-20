import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../redux/features/snackbarSlice";

interface DialogRegisterCategoryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DialogRegisterCategory: React.FC<DialogRegisterCategoryProps> = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setError(null);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) {
      setError(null); 
    }
  };

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
      setError(null);
      const params = { name: name };
      const response = await fetchApiNodeNoticies("POST", "register-category", params);
      if (response.success) {
        onSuccess();
        onClose();
        dispatch(openSnackbar({ message: response.message, severity: 'success' }));
      } else {
        dispatch(openSnackbar({ message: response.message, severity: 'error' }));
      }
    } catch (error) {
      console.log("Error en el registro: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold"}}>Registrar Categoría</DialogTitle>
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
          onChange={handleChange}
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
