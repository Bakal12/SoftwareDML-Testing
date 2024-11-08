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
  const [editingCell, setEditingCell] = useState(null);


  const createRepuesto = async () => {
    await addDoc(repuestosCollectionRef, {
      codigo: newCodigo,
      descripcion: newDescipcion,
      cantidad_disponible: Number(newCantDisp),
      numero_estanteria: newNumeroEstanteria,
      numero_estante: newNumeroEstante,
      numero_BIN: newNumeroBIN,
      posicion_BIN: newPosicionBIN
    });

    setRepuestos((prevRepuestos) => [
      ...prevRepuestos,
      {
        id: repuestosCollectionRef.id,
        codigo: newCodigo,
        descripcion: newDescipcion,
        cantidad_disponible: Number(newCantDisp),
        numero_estanteria: newNumeroEstanteria,
        numero_estante: newNumeroEstante,
        numero_BIN: newNumeroBIN,
        posicion_BIN: newPosicionBIN
      },
    ]);

  };

  const updateRepuesto = async (id, field, value) => {
    const repuestoDoc = doc(db, "repuestos", id);
    await updateDoc(repuestoDoc, { [field]: value });

    setRepuestos((prevRepuestos) =>
      prevRepuestos.map((repuesto) =>
        repuesto.id === id ? { ...repuesto, [field]: value } : repuesto
      )
    );

  };

  const deleteRepuesto = async (id) => {
    const userDoc = doc(db, "repuestos", id);
    await deleteDoc(userDoc);

    setRepuestos((prevRepuestos) => prevRepuestos.filter((repuesto) => repuesto.id !== id));

  };

  useEffect(() => {
    const getRepuestos = async () => {
      const data = await getDocs(repuestosCollectionRef);
      setRepuestos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getRepuestos();
  }, []);

  const makeEditable = (repuestoId, field, initialValue) => {
    return (
      <input
        type="text"
        defaultValue={initialValue}
        onBlur={(e) => {
          updateRepuesto(repuestoId, field, e.target.value);
          setEditingCell(null);  // Esto hace que el campo de edición desaparezca al perder el foco
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateRepuesto(repuestoId, field, e.target.value);
            setEditingCell(null);  // Esto hace que el campo de edición desaparezca al presionar Enter
          }
        }}
        autoFocus
      />
    );
  };

  return (
    <div className="Repuestos">
      <body>
        <header>
          <nav>
            <ul>
              <li><a href="/Repuestos">Buscar Componentes Electrónicos</a></li>
              <li><a href="/Home">Revisar Dispositivos Electrónicos por Entregar</a></li>
            </ul>
          </nav>
        </header>
        <main>
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
                    <tr key={repuestos.id}>
                      {["codigo", "descripcion", "cantidad_disponible", "numero_estanteria", "numero_estante", "numero_BIN", "posicion_BIN"].map((field) => (
                        <td key={field} onDoubleClick={() => setEditingCell({ id: repuestos.id, field })}>
                          {editingCell?.id === repuestos.id && editingCell.field === field
                            ? makeEditable(repuestos.id, field, repuestos[field])
                            : repuestos[field]}
                        </td>
                      ))}
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
        </main>
      </body>
    </div>
  );
}

export default Repuestos;