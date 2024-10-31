import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [newCodigo, setNewCodigo] = useState("");
  const [newDescipcion, setNewDescripcion] = useState("");
  const [newCantDisp, setNewCantDisp] = useState(0)
  const [newNumeroEstanteria, setNewNumEstanteria] = useState("")
  const [newNumeroEstante, setNewNumeroEstante] = useState("")
  const [newNumeroBIN, setNewNumeroBIN] = useState("")
  const [newPosicionBIN, setNewPosicionBIN] = useState("")


  const [users, setUsers] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const repuestosCollectionRef = collection(db, 'repuestos');
  const usersCollectionRef = collection(db, "users");

  const createRepuesto = async () => {
    await addDoc(repuestosCollectionRef, { codigo: newCodigo, descripcion: newDescipcion, cantidad_disponible: Number(newCantDisp), numero_estanteria: newNumeroEstanteria, numero_estante: newNumeroEstante, numero_BIN: newNumeroBIN, posicion_BIN: newPosicionBIN });
  };

  const updateUser = async (id, edad) => {
    const userDoc = doc(db, "users", id);
    const newFields = { edad: edad + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      console.log(data);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getRepuestos = async () => {
      const data = await getDocs(repuestosCollectionRef);
    //  console.log(doc.id);
      setRepuestos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getRepuestos();
    getUsers();
  }, []);

  return (
    <div className="App">
      <input
        placeholder="Codigo..."
        onChange={(event) => {
          setNewCodigo(event.target.value);
        }}
      />
      <input
        placeholder="Descripcion..."
        onChange={(event) => {
          setNewDescripcion(event.target.value);
        }}
      />
      <input
        type="number"
        placeholder="Cantidad disponible..."
        onChange={(event) => {
          setNewCantDisp(event.target.value);
        }}
      />
      <input
        placeholder="Numero estanteria..."
        onChange={(event) => {
          setNewNumEstanteria(event.target.value);
        }}
      />
      <input
        placeholder="Numero estante..."
        onChange={(event) => {
          setNewNumeroEstante(event.target.value);
        }}
      />
      <input
        placeholder="Numero BIN..."
        onChange={(event) => {
          setNewNumeroBIN(event.target.value);
        }}
      />
      <input
        placeholder="Posicion BIN..."
        onChange={(event) => {
          setNewPosicionBIN(event.target.value);
        }}
      />

      <button onClick={createRepuesto}> Crear repuesto</button>
      <h2>Lista de repuestos</h2>
      <table>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Descripcion</th>
            <th>Cantidad disponible</th>
            <th>Numero estanteria</th>
            <th>Numero estante</th>
            <th>Numero BIN</th>
            <th>Posicion BIN</th>
            <th>Acciones</th>
          </tr>
        </thead>
      </table>
      {repuestos.map((repuestos) => {
        return (
          <div>
            <section>
              <table>
                <tbody>
                  <tr>
                    <td>{repuestos.codigo}</td>
                    <td>{repuestos.descripcion}</td>
                    <td>{repuestos.cantidad_disponible}</td>
                    <td>{repuestos.numero_estanteria}</td>
                    <td>{repuestos.numero_estante}</td>
                    <td>{repuestos.numero_BIN}</td>
                    <td>{repuestos.posicion_BIN}</td>
                    <td>Poner imagenes</td>
                  </tr>
                </tbody>
             </table>
            </section>
          </div>
        );
      })}
    </div>
  );
}

export default App;