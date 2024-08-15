import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import { UserProvider } from "./context/UseProvider";
import { PrivateRoute } from "./routes/PrivateRoutes";
import { routes } from "./routes";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/login/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      {/* <UserProvider> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              // <PrivateRoute>
                <Header />
              // </PrivateRoute>
            }
          >
            {routes}
          </Route>
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      {/* </UserProvider> */}
    </BrowserRouter>
  );
}

export default App;
