import { IconButton } from "@mui/material";
import SwitchComponent from "../../components/common/SwitchComponent";
import "../../styles/Noticias.css";
import { Delete, Edit } from "@mui/icons-material";

export const NoticiasPage = () => {

  return (
    <div>
      <h2 className="p-2">Listado de Noticias</h2>
      <div className="container-table">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            <tr>
              <th scope="row">1</th>
              <td>Categoria 1</td>
              <td>
                <SwitchComponent />
              </td>
              <td>
                <div>
                  <IconButton > 
                    <Edit color="primary"/> 
                  </IconButton>
                  <IconButton> 
                    <Delete color="error"/> 
                  </IconButton>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>Categoria 2</td>
              <td>
                <SwitchComponent />
              </td>
              <td>
                <div>
                  <IconButton > 
                    <Edit color="primary"/> 
                  </IconButton>
                  <IconButton> 
                    <Delete color="error"/> 
                  </IconButton>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">1</th>
              <td>Categoria 3</td>
              <td>
                <SwitchComponent />
              </td>
              <td>
                <div>
                  <IconButton > 
                    <Edit color="primary"/> 
                  </IconButton>
                  <IconButton> 
                    <Delete color="error"/> 
                  </IconButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
