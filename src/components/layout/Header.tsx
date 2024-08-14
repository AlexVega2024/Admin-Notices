import React from "react";
import "../../styles/Header.css";
import { ImageComponent } from "../common/ImageComponent";

const Header = () => {
  return (
    <div className="header">
      <ImageComponent urlImage="https://futurolamanense.fin.ec/static/media/logoblanco.53771e5f3f87a61c43a7.png"/>
    </div>
  );
};

export default Header;