import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Switch, Tooltip } from '@mui/material';
import { AddCircle, Delete, Edit } from '@mui/icons-material';
import { ICategory } from '../../interfaces/Notice.interface';
import { fetchApiNodeNoticies } from '../../helpers/fetchData';
import DialogRegisterCategory from '../../components/common/DialogRegisterCategory';
import DialogEditCategory from '../../components/common/DialogEditCategory';
import SnackbarNotification from '../../components/common/SnackBarComponent';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../redux/features/snackbarSlice';

export const CategoriasPage = () => {
  const dispatch = useDispatch();
  const [listDataCategories, setListDataCategories] = useState<ICategory[]>([]);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const handleDataNoticies = async () => {
    try {
      const categories = await fetchApiNodeNoticies("GET", "get-categories");
      if (categories.success) {
        setListDataCategories(categories.data);
      } else {
        setListDataCategories([]);
        dispatch(openSnackbar({ message: categories.message, severity: 'error' }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    handleDataNoticies();
  }, [dispatch]);

  const handleSwitchChange = async (checked: boolean, id_category: number) => {
    try {
      const params = {
        state_categ: checked ? 1 : 0,
        id_category: id_category,
      };
      const response = await fetchApiNodeNoticies("POST", "state-category", params);
      if (response.success) {
        dispatch(openSnackbar({ message: response.message, severity: 'success' }));
        await handleDataNoticies();
      } else {
        dispatch(openSnackbar({ message: response.message, severity: 'error' }));
      }
    } catch (error) {
      console.error("Error updating category state:", error);
    }
  };

  const handleOpenRegisterDialog = () => setOpenRegisterDialog(true);
  const handleCloseRegisterDialog = () => setOpenRegisterDialog(false);

  const handleOpenEditDialog = (category: ICategory) => {
    setSelectedCategory(category);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedCategory(null);
    setOpenEditDialog(false);
  };

  const handleDialogSuccess = async () => {
    await handleDataNoticies();
  };

  const handleDeleteCategory = async (id_category: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        const params = { id_category };
        const deleteCategory = await fetchApiNodeNoticies("POST", 'delete-category', params);
        if (deleteCategory.success) {
          dispatch(openSnackbar({ message: deleteCategory.message, severity: 'success' }));
          await handleDataNoticies();
        }
      } catch (error) {
        console.error("Error eliminando la categoría:", error);
        dispatch(openSnackbar({ message: "Verifica que no existan noticias que dependan del id de esta categoría.", severity: 'error' }));
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="p-2">Listado de Categorías</h3>
        <Box>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<AddCircle />}
            onClick={handleOpenRegisterDialog}
          >
            Registrar
          </Button>
        </Box>
      </div>
      <div className="table-responsive">
        <table className="table table-striped border border-dark">
          <thead className="text-center text-white" style={{ backgroundColor: "#203b79" }}>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider text-center">
            {
              listDataCategories.length > 0 
              ?
              (
                listDataCategories.map((item: ICategory) => (
                  <tr key={item.id_category}>
                    <td>{item.id_category}</td>
                    <td>{item.name}</td>
                    <td>
                      <Tooltip title="Inactivar">
                        <Switch
                          checked={item.state_categ === 1}
                          onChange={(e) => handleSwitchChange(e.target.checked, item.id_category)}
                        />
                      </Tooltip>
                    </td>
                    <td>
                      <div>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleOpenEditDialog(item)}>
                            <Edit color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton onClick={() => handleDeleteCategory(item.id_category)}>
                            <Delete color="error" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )
              :
              (
                <tr></tr>
              )
            }
          </tbody>
        </table>
      </div>
      {/* Diálogo de registro */}
      <DialogRegisterCategory
        open={openRegisterDialog}
        onClose={handleCloseRegisterDialog}
        onSuccess={handleDialogSuccess}
      />

      {/* Diálogo de edición */}
      {selectedCategory && (
        <DialogEditCategory
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          category={selectedCategory}
          onSuccess={handleDialogSuccess}
        />
      )}

      {/* Snackbar para mensajes */}
      <SnackbarNotification />
    </div>
  );
};
