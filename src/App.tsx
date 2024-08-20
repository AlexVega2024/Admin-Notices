import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import { UserProvider } from "./context/UseProvider";
import { routes } from "./routes";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import LoginPage from "./pages/login/LoginPage";
import { PrivateRoute, PublicRoute } from "./routes/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Header />
              </PrivateRoute>
            }
          >
            {routes}
          </Route>
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
