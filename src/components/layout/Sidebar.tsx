import { NavLink } from "react-router-dom";
import "../../styles/Sidebar.css"

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="link-group">
        <NavLink className="link" to={"#"}>
          <i className="bi bi-house-fill me-2 fs-4"></i>
          <span>Home</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
