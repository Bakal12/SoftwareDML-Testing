import "./general.css";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Repuestos = () => {
    const [newCodigo, setNewCodigo] = useState("");
    const [newDescipcion, setNewDescripcion] = useState("");
    const [newCantDisp, setNewCantDisp] = useState(0)
    const [newNumeroEstanteria, setNewNumEstanteria] = useState("")
    const [newNumeroEstante, setNewNumeroEstante] = useState("")
    const [newNumeroBIN, setNewNumeroBIN] = useState("")
    const [newPosicionBIN, setNewPosicionBIN] = useState("")
  
    const [repuestos, setRepuestos] = useState([]);
    const repuestosCollectionRef = collection(db, 'repuestos');
  
    const createRepuesto = async () => {
      await addDoc(repuestosCollectionRef, { codigo: newCodigo, descripcion: newDescipcion, cantidad_disponible: Number(newCantDisp), numero_estanteria: newNumeroEstanteria, numero_estante: newNumeroEstante, numero_BIN: newNumeroBIN, posicion_BIN: newPosicionBIN });
    };
  
    const deleteRepuesto = async (id) => {
      const userDoc = doc(db, "repuestos", id);
      await deleteDoc(userDoc);
    };
    useEffect(() => {
      const getRepuestos = async () => {
        const data = await getDocs(repuestosCollectionRef);
        setRepuestos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      };
  
      getRepuestos();
    }, []);


    return(
        <div className="Repuestos">
            <header>
               <nav>
                    <ul>
                        <li><a href="/Repuestos">Buscar Componentes Electrónicos</a></li>
                        <li><a href="/Dispositivos">Revisar Dispositivos Electrónicos por Entregar</a></li>
                    </ul>
                </nav> 
            </header>
            <tablex>
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
                 placeholder="Posiciason BIN..."
                 onChange={(event) => {
                    setNewPosicionBIN(event.target.value);
                  }}
                />
                <button onClick={createRepuesto}> Crear repuesto</button>
            </tablex>
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
                                    <td>
                                    <buttona onClick={() => { deleteRepuesto(repuestos.id); }}> Eliminar repuesto </buttona>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            }
            )
            }
        </div>
  );
}

export default Repuestos;