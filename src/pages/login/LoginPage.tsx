import { Login } from "@mui/icons-material";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UseContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { ImageComponent } from "../../components/common/ImageComponent";
import { assets } from "../../assets";

const LoginPage = () => {
  const navigate = useNavigate();
  const initialForm = {
    user: '',
    password: ''
  };

  const { user, password, onInputChange, reset }: any = useForm(initialForm);
  const { setDataUser }: any = useContext(UserContext);

  const [errors, setErrors] = useState<{ user: string, password: string }>({ user: '', password: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { user: '', password: '' };

    if (!user.trim()) {
      newErrors.user = 'El usuario es requerido';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const HandleSubmit = async () => {
    // Verifica si el formulario es válido
    if (!validateForm()) {
      return;
    }
  
    try {
      const params = { 'usuario': user, 'clave': password };
      

      const response = await fetch("https://192.100.10.49:8099/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
  
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      
      const data = await response.json();
      console.log(data);
  
      
      if (data.token != null) {
        sessionStorage.setItem('token', data.token); 
        setDataUser(data.token);
        navigate('/');
      } else if (data.error) {
        setErrors({ user: 'Usuario y/o contraseña son incorrectos', password: '' });
      }
    } catch (error) {
      console.error('Error al loguearse:', error);
    } finally {
      reset(); // Limpia los campos del formulario
    }
  };
  

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      spacing={0}
      sx={{ height: "100vh", padding: 2 }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
      >
        <Box
          sx={{
            width: '100%',
            border: "1px solid black",
            borderRadius: "5px",
            backgroundColor: "#e4e9f7",
            padding: 3,
            boxShadow: 3,
            textAlign: 'center'
          }}
        >
          <Box sx={{ marginBottom: 4 }}>
            <ImageComponent urlImage={assets.images.logoNegro} typeImage="login" name="logo"/>
          </Box>
          <Typography variant="h4" color="black" gutterBottom>
            Login
          </Typography>
          <TextField
            required
            name="user"
            label="Usuario"
            fullWidth
            margin="normal"
            variant="filled"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
            value={user ?? ""}
            onChange={onInputChange}
            error={Boolean(errors.user)}
            helperText={errors.user}
          />
          <TextField
            required
            name="password"
            label="Contraseña"
            fullWidth
            margin="normal"
            variant="filled"
            sx={{ backgroundColor: "white", borderRadius: 1 }}
            value={password ?? ""}
            onChange={onInputChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ marginTop: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Login />}
              sx={{
                bgcolor: "#203b79",
                height: "50px",
                "&:hover": {
                  bgcolor: "#486ec7",
                },
                "&.Mui-focused": {
                  bgcolor: "#486ec7",
                },
              }}
              onClick={HandleSubmit}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
