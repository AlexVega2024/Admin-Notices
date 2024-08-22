
import { Snackbar, Alert } from '@mui/material';
import { closeSnackbar } from '../../redux/features/snackbarSlice';
import { useDispatch, useSelector } from 'react-redux';

const SnackbarNotification = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: { snackbar: any; }) => state.snackbar)

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
