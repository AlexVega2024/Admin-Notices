import { Box, Button, IconButton, Switch, Tooltip } from "@mui/material";
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { IGallery } from "../../interfaces/Notice.interface";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import DialogRegisterGallery from "../../components/common/DialogRegisterGallery";
import DialogEditGallery from "../../components/common/DialogEditGallery";

export const GaleriaPage = () => {
  const [listDataGalery, setListDataGalery] = useState<IGallery[]>([]);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<IGallery | null>(null);

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
    setSelectedGallery(gallery);
    setOpenEditDialog(true);
  };

  const handleDialogSuccess = () => {
    fetchApiNodeNoticies("GET", "get-galleries")
      .then(galleries => setListDataGalery(galleries || []))
      .catch(error => console.error("Error fetching categories:", error));
  };

  const handleCloseEditDialog = () => {
    setSelectedGallery(null);
    setOpenEditDialog(false);
  };

  const handleDeleteGallery = async (id_gallery: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta imagen de la galería?")) {
      try {
        const params = {id_gallery: id_gallery};
        await fetchApiNodeNoticies("POST", 'delete-gallery', params);
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
                      <IconButton onClick={() => handleDeleteGallery(item.id_gallery)}>
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
      {selectedGallery && (
        <DialogEditGallery
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          gallery={selectedGallery}
          onSuccess={handleDialogSuccess}
        />
      )}
    </div>
  );
};
