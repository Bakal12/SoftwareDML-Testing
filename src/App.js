import { useContext } from "react";
import Dispositivos from "./pages/Dispositivos";
import Login from "./pages/Login";
import Repuestos from "./pages/Repuestos";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { db } from "./firebase-config";


function App() {

  const {currentUser} = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login"  replace/>;
  };

  return (
    <div className={"app"}>
      <BrowserRouter>
        <Routes>
            <Route path="login" element={<Login />} />
            <Route 
              path="/dispositivos" 
              element={
               <RequireAuth>
                 <Dispositivos />
               </RequireAuth>
              } 
            />
            <Route 
              path="/repuestos" 
              element={
                <RequireAuth>
                  <Repuestos />
                </RequireAuth>
              } 
            />
            <Route 
              path="/" 
              element={
                <RequireAuth>
                  <Navigate to="/dispositivos" />
                </RequireAuth>
              } 
            />
            <Route/>
        </Routes>
      </BrowserRouter>
    </div>
    );
};

export default App;
