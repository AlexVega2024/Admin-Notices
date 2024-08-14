import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <div>
      <Header />
      <div className="d-flex">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard></Dashboard>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
