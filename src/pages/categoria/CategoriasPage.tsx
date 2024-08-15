import { IconButton } from "@mui/material";
import React from "react";
import SwitchComponent from "../../components/common/SwitchComponent";
import { Delete, Edit } from "@mui/icons-material";
import TableComponent from "../../components/common/TableComponent";

export const CategoriasPage = () => {
  return (
    <div>
      <h2 className="p-2">Listado de Categorías</h2>
      <div className="container-table">
        <TableComponent />
      </div>
    </div>
  );
};
