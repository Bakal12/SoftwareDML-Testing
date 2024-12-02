import React, { useState, useEffect, useRef } from 'react'
import { db } from "../firebase-config"
import { Pagination } from '@mui/material';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore"
import './repuestos.css'



export default function Repuestos() {

  const [newCodigo, setNewCodigo] = useState("")
  const [newDescripcion, setNewDescripcion] = useState("")
  const [newCantDisp, setNewCantDisp] = useState(0)
  const [newNumeroEstanteria, setNewNumEstanteria] = useState("")
  const [newNumeroEstante, setNewNumeroEstante] = useState("")
  const [newNumeroBIN, setNewNumeroBIN] = useState("")
  const [newPosicionBIN, setNewPosicionBIN] = useState("")

  const repuestosCollectionRef = collection(db, 'repuestos')
  const [editingCell, setEditingCell] = useState(null)
  const [showNewRepuestoForm, setShowNewRepuestoForm] = useState(false)

  const [allRepuestos, setAllRepuestos] = useState([]); // Todos los registros
  const [displayedRepuestos, setDisplayedRepuestos] = useState([]); // Registros actuales en pantalla
  const [limit, setLimit] = useState(5); // Límite por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const textareaRef = useRef(null);

  if (textareaRef.current) {
    textareaRef.current.style.height = "auto"; // Restablece la altura
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Establece la nueva altura
  }


  const createRepuesto = async () => {
    await addDoc(repuestosCollectionRef, {
      codigo: newCodigo,
      descripcion: newDescripcion,
      cantidad_disponible: Number(newCantDisp),
      numero_estanteria: newNumeroEstanteria,
      numero_estante: newNumeroEstante,
      numero_BIN: newNumeroBIN,
      posicion_BIN: newPosicionBIN
    })

    setAllRepuestos((prevRepuestos) => [
      ...prevRepuestos,
      {
        id: repuestosCollectionRef.id,
        codigo: newCodigo,
        descripcion: newDescripcion,
        cantidad_disponible: Number(newCantDisp),
        numero_estanteria: newNumeroEstanteria,
        numero_estante: newNumeroEstante,
        numero_BIN: newNumeroBIN,
        posicion_BIN: newPosicionBIN
      },
    ])

    setShowNewRepuestoForm(false)
  }

  const updateRepuesto = async (id, field, value) => {
    const repuestoDoc = doc(db, "repuestos", id)
    await updateDoc(repuestoDoc, { [field]: value })

    setAllRepuestos((prevRepuestos) =>
      prevRepuestos.map((repuesto) =>
        repuesto.id === id ? { ...repuesto, [field]: value } : repuesto
      )
    )
  }

  const deleteRepuesto = async (id) => {
    const userDoc = doc(db, "repuestos", id)
    await deleteDoc(userDoc)

    setAllRepuestos((prevRepuestos) => prevRepuestos.filter((repuesto) => repuesto.id !== id))
  }

  // Obtener todos los registros al cargar el componente
  useEffect(() => {
    const fetchAllRepuestos = async () => {
      setIsLoading(true); // Inicia la carga
      try {
        const data = await getDocs(query(repuestosCollectionRef, orderBy("codigo", "asc")));
        const repuestos = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAllRepuestos(repuestos); // Guardar todos los registros
        setTotalPages(Math.ceil(repuestos.length / limit)); // Calcular el número total de páginas
        setDisplayedRepuestos(repuestos.slice(0, limit)); // Mostrar la primera página



      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchAllRepuestos();
  }, [limit]);

  // Actualizar los registros mostrados cuando cambie la página o el límite
  useEffect(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedRepuestos(allRepuestos.slice(startIndex, endIndex)); // Mostrar los registros de la página actual
  }, [currentPage, limit, allRepuestos]);

  const makeEditable = (repuestoId, field, initialValue) => {
    return (
      <textarea
        ref={textareaRef}
        className="input"
        rows={2}
        defaultValue={initialValue}
        onBlur={(e) => {
          updateRepuesto(repuestoId, field, e.target.value)
          setEditingCell(null)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateRepuesto(repuestoId, field, e.target.value)
            setEditingCell(null)
          }
        }}
        autoFocus
      />
    )
  }

  return (
    <div className="min-h-screen">
      <header className="header">
        <nav className="nav">
          <ul>
            <li>
              <a href="/pp/dml/repuestos" className="nav-link">
                Buscar Componentes Electrónicos
              </a>
            </li>
            <li>
              <a href="/pp/dml/home" className="nav-link">
                Revisar Dispositivos Electrónicos por Entregar
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Gestión de repuestos</h2>
          </div>
          <div className="card-content">
            <button className="button" onClick={() => setShowNewRepuestoForm(!showNewRepuestoForm)}>
              {showNewRepuestoForm ? 'Cancelar' : 'Crear Nuevo Repuesto'}
            </button>
            {showNewRepuestoForm && (
              <div className='new-repuesto-form'>
                <h3>Crear nuevo repuesto</h3>
                <div className="form-grid">
                  <textarea className="input" rows={1} placeholder="Codigo..." onChange={(e) => setNewCodigo(e.target.value)} />
                  <textarea className="input" rows={1} placeholder="Descripcion..." onChange={(e) => setNewDescripcion(e.target.value)} />
                  <input className="input" type="number" placeholder="Cantidad disponible..." onChange={(e) => setNewCantDisp(e.target.value)} />
                  <textarea className="input" rows={1} placeholder="Numero estanteria..." onChange={(e) => setNewNumEstanteria(e.target.value)} />
                  <textarea className="input" rows={1} placeholder="Numero estante..." onChange={(e) => setNewNumeroEstante(e.target.value)} />
                  <textarea className="input" rows={1} placeholder="Numero BIN..." onChange={(e) => setNewNumeroBIN(e.target.value)} />
                  <textarea className="input" rows={1} placeholder="Posicion BIN..." onChange={(e) => setNewPosicionBIN(e.target.value)} />
                </div>
                <button className="button-newRepuesto" onClick={createRepuesto}>Crear Repuesto</button>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Lista de Repuestos</h2>
            {/* Selector de límite */}
            <label htmlFor="limit" className=''>Resultados por página: </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1); // Reiniciar a la página 1 al cambiar el límite
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={allRepuestos.length}>Todos</option>
            </select>
          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="table">
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
                <tbody>
                  {displayedRepuestos.map((repuesto) => (
                    <tr key={repuesto.id}>
                      {["codigo", "descripcion", "cantidad_disponible", "numero_estanteria", "numero_estante", "numero_BIN", "posicion_BIN"].map((field) => (
                        <td key={field} onDoubleClick={() => setEditingCell({ id: repuesto.id, field })}>
                          {editingCell?.id === repuesto.id && editingCell.field === field
                            ? makeEditable(repuesto.id, field, repuesto[field])
                            : repuesto[field]}
                        </td>
                      ))}
                      <td>
                        <button className="button button-destructive" onClick={() => deleteRepuesto(repuesto.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Paginación */}
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages} // Número total de páginas
                  page={currentPage} // Página actual
                  onChange={(event, value) => setCurrentPage(value)} // Cambiar página
                  color="primary"
                  disabled={isLoading} // Deshabilitar mientras los datos cargan
                />
              </div>
              {/* Indicador de carga */}
              {isLoading && <p>Cargando...</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


