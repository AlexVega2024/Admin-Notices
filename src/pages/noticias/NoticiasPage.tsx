import { Box, Button, IconButton, Switch, Tooltip } from "@mui/material";
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";
import { INotice } from "../../interfaces/Notice.interface";
import DialogRegisterNoticies from "../../components/common/DialogRegisterNoticies";
import DialogEditCategories from "../../components/common/DialogEditNoticies";
import { formatDateTime } from "../../helpers/formatDate";

export const NoticiasPage = () => {
  const [listDataNotices, setListDataNotices] = useState<INotice[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<INotice | null>(null);

  useEffect(() => {
    const handleDataNoticies = async () => {
      try {
        const noticies = await fetchApiNodeNoticies("GET", "get-noticies");
        setListDataNotices(noticies || []);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setListDataNotices([]);
      }
    };
    handleDataNoticies();
  }, []);

  const handleSwitchChange = async (
    id_notice: number,
    id_category: number,
    checked: boolean
  ) => {
    if (id_notice && id_category) {
      try {
        const params = {
          id_notice: id_notice,
          id_category: id_category,
          state_notice: checked ? 1 : 0,
        };
        await fetchApiNodeNoticies("POST", "state-noticie", params);
        location.reload();
      } catch (error) {
        console.error("Error updating notice state:", error);
      }
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleOpenEditModal = (notice: INotice) => {
    setSelectedNotice(notice);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedNotice(null);
    setOpenEditModal(false);
  };

  const handleModalSuccess = () => {
    fetchApiNodeNoticies("GET", "get-noticies")
      .then((noticies) => setListDataNotices(noticies || []))
      .catch((error) => console.error("Error fetching notices:", error));
  };

  const handleDeleteNotice = async (id_notice: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta noticia?")) {
      try {
        const params = {id_notice: id_notice};
        await fetchApiNodeNoticies("POST", 'delete-noticie', params);
        alert("Se eliminó correctamente la noticia.");
        location.reload();
      } catch (error) {
        console.error("Error eliminando la noticia:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="p-2">Listado de Noticias</h2>
        <Box>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<AddCircle />}
            onClick={handleOpenModal}
          >
            Registrar
          </Button>
        </Box>
      </div>

      {/* Contenedor responsivo para la tabla */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead
            className="text-center text-white"
            style={{ backgroundColor: "#203b79" }}
          >
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Imagen Banner</th>
              <th scope="col">Imagen Card</th>
              <th scope="col">Título</th>
              <th scope="col">Descripción</th>
              <th scope="col">Fecha y Hora</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider text-center">
            {listDataNotices.map((item: INotice) => (
              <tr key={item.id_notice}>
                <td>{item.id_notice}</td>
                <td>{item.img_banner}</td>
                <td>{item.img_card}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{formatDateTime(item.date_time!)}</td>
                <td>
                  <Switch
                    checked={item.state_notice === 1}
                    onChange={(e) =>
                      handleSwitchChange(
                        item.id_notice,
                        item.id_category!,
                        e.target.checked
                      )
                    }
                  />
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenEditModal(item)}>
                        <Edit color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteNotice(item.id_notice)}
                      >
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

      {/* Dialog de registro*/}
      <DialogRegisterNoticies
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />

      {/* Dialog de editar*/}
      {selectedNotice && (
        <DialogEditCategories
          open={openEditModal}
          onClose={handleCloseEditModal}
          notice={selectedNotice}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};
