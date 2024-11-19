import { useContext } from "react";
import Login from "./pages/Login";
import Repuestos from "./pages/Repuestos";
import Home from "./pages/Home"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function App() {

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/pp/dml/login" />;
  };

  return (
    <div className={"app"}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={currentUser ? <Navigate to="/pp/dml/home" /> : <Navigate to="/pp/dml/login" />}
            />
            <Route path="pp/dml/login" element={<Login />} />
            <Route
              path="/pp/dml/repuestos"
              element={
                <RequireAuth>
                  <Repuestos />
                </RequireAuth>
              }
            />
            <Route
              path="/pp/dml/home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
