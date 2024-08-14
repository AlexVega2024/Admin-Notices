import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <div className="row">
      <div className="col-12">
        <Header />
      </div>
      <div className="col-2 container-sidebar m-auto">
        <Sidebar />
      </div>
      <div className="col-10">
        <Routes>
          <Route path="/" element={<Dashboard></Dashboard>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
