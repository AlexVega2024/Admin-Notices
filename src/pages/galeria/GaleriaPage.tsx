import { Box, Button, IconButton, Switch, Tooltip } from "@mui/material";
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ICategory, IGallery } from "../../interfaces/Notice.interface";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import DialogRegisterCategory from "../../components/common/DialogRegisterCategory";
import DialogEditCategory from "../../components/common/DialogEditCategory";
import DialogRegisterGallery from "../../components/common/DialogRegisterGallery";

export const GaleriaPage = () => {
  const [listDataGalery, setListDataGalery] = useState<IGallery[]>([]);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<ICategory | null>(null);

  useEffect(() => {
    const handleDataNoticies = async () => {
      try {
        const gallery = await fetchApiNodeNoticies("GET", "get-galleries");
        setListDataGalery(gallery || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setListDataGalery([]);
      }
    };
    handleDataNoticies();
  }, []);

  const handleSwitchChange = async (checked: boolean, id_notice: number) => {
    if (id_notice) {
      try {
        const params = {
          state_image: checked ? 1 : 0,
          id_notice: id_notice,
        };
        await fetchApiNodeNoticies("POST", "state-gallery", params);
        location.reload();
      } catch (error) {
        console.error("Error updating category state:", error);
      }
    }
  };

  const handleOpenRegisterDialog = () => setOpenRegisterDialog(true);
  const handleCloseRegisterDialog = () => setOpenRegisterDialog(false);

  const handleOpenEditDialog = (gallery: IGallery) => {
    console.log("Data Gallery: ", gallery);
    // setSelectedCategory(category);
    setOpenEditDialog(true);
  };

  const handleDialogSuccess = () => {
    fetchApiNodeNoticies("GET", "get-galleries")
      .then(galleries => setListDataGalery(galleries || []))
      .catch(error => console.error("Error fetching categories:", error));
  };

  // const handleCloseEditDialog = () => {
  //   setSelectedCategory(null);
  //   setOpenEditDialog(false);
  // };

  // const handleDialogSuccess = () => {
  //   fetchApiNodeNoticies("GET", "get-categories")
  //     .then(categories => setListDataCategories(categories || []))
  //     .catch(error => console.error("Error fetching categories:", error));
  // };

  const handleDeleteCategory= async (id_category: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta imagen de la galería?")) {
      try {
        // const params = {id_category: id_category};
        // await fetchApiNodeNoticies("POST", 'delete-category', params);
        alert("Se eliminó correctamente la imagen.");
        location.reload();
      } catch (error) {
        console.error("Error eliminando la imagen:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="p-2">Listado de Imágenes</h2>
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
        <table className="table table-striped">
          <thead className="text-center text-white" style={{ backgroundColor: "#203b79" }}>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">IdNoticia</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider text-center">
            {listDataGalery.map((item: IGallery) => (
              <tr key={item.id_gallery}>
                <td>{item.id_gallery}</td>
                <td>{item.name_image}</td>
                <td>
                  <Tooltip title="Inactivar">
                    <Switch
                      checked={item.state_image === 1}
                      onChange={(e) => handleSwitchChange(e.target.checked, item.id_gallery)}
                    />
                  </Tooltip>
                </td>
                <td>{item.id_notice}</td>
                <td>
                  <div>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenEditDialog(item)}>
                        <Edit color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDeleteCategory(item.id_gallery)}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Diálogo de registro */}
      <DialogRegisterGallery
        open={openRegisterDialog}
        onClose={handleCloseRegisterDialog}
        onSuccess={handleDialogSuccess}
      />

      {/* Diálogo de edición */}
      {/* {selectedCategory && (
        <DialogEditCategory
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          category={selectedCategory}
          onSuccess={handleDialogSuccess}
        />
      )} */}
    </div>
  );
};
