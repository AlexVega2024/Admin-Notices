import { Box, Button, IconButton, Switch, Tooltip } from "@mui/material";
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ICategory } from "../../interfaces/Notice.interface";
import { fetchApiNodeNoticies } from "../../helpers/fetchData";

export const CategoriasPage = () => {
  const [listDataCategories, setListDataCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const handleDataNoticies = async () => {
      try {
        const cateogies = await fetchApiNodeNoticies("GET", "get-categories");
        setListDataCategories(cateogies || []);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setListDataCategories([]);
      }
    };
    handleDataNoticies();
  }, []);

  const handleSwitchChange = async (
    id_category: number,
    checked: boolean
  ) => {
    if (id_category) {
      try {
        const params = {
          state_categ: checked ? 1 : 0,
          id_category: id_category,
        };
        await fetchApiNodeNoticies("POST", "state-category", params);
        location.reload();
      } catch (error) {
        console.error("Error updating notice state:", error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="p-2">Listado de Categorías</h2>
        <Box sx={{ marginRight: "10%" }}>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<AddCircle />}
          >
            Registrar
          </Button>
        </Box>
      </div>
      <div className="d-flex justify-content-center align-items-center px-5">
        <table className="table table-striped" style={{ width: "85%" }}>
          <thead
            className="text-center text-white"
            style={{ backgroundColor: "#203b79" }}
          >
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider text-center">
            {listDataCategories.map((item: ICategory) => (
              <tr key={item.id_category}>
                <th>{item.id_category}</th>
                <td>{item.name}</td>
                <td>
                  <Tooltip title="Inactivar">
                    <Switch
                      checked={item.id_category === 1}
                      onChange={(e) =>
                        handleSwitchChange(
                          item.id_category,
                          e.target.checked
                        )
                      }
                    />
                  </Tooltip>
                </td>
                <td>
                  <div>
                    <Tooltip title="Editar">
                      <IconButton>
                        <Edit color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton>
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
    </div>
  );
};
