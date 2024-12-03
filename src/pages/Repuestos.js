import React, { useState, useEffect } from 'react'
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
  startAt,
  endAt,
} from "firebase/firestore"
import './repuestos.css'



export default function Repuestos() {

  /*-------------------------------------- VARIABLES --------------------------------------*/

  // Variables que hacen referencia a los campos de la db
  const [newCodigo, setNewCodigo] = useState("")
  const [newDescripcion, setNewDescripcion] = useState("")
  const [newCantDisp, setNewCantDisp] = useState(0)
  const [newNumeroEstanteria, setNewNumEstanteria] = useState("")
  const [newNumeroEstante, setNewNumeroEstante] = useState("")
  const [newNumeroBIN, setNewNumeroBIN] = useState("")
  const [newPosicionBIN, setNewPosicionBIN] = useState("")
  const repuestosCollectionRef = collection(db, 'repuestos') // Referencia a la coleccion de la db

  const [editingCell, setEditingCell] = useState(null) // Variable que referencia a editar las celdas

  const [showNewRepuestoForm, setShowNewRepuestoForm] = useState(false) // Variable que referencia a mostrar la grilla para crear nuevo repuesto

  const [allRepuestos, setAllRepuestos] = useState([]); // Variable que guarda todo el array de registros en la coleccion de la db
  const [displayedRepuestos, setDisplayedRepuestos] = useState([]); // Guarda registros actuales en pantalla
  const [limit, setLimit] = useState(5); // Guarda el límite por página
  const [currentPage, setCurrentPage] = useState(1); // Guarda la página actual
  const [totalPages, setTotalPages] = useState(1); // Guarda el total de páginas
  const [isLoading, setIsLoading] = useState(true); // Guarda el estado de carga

  const [searchTerm, setSearchTerm] = useState("") // Guarda el "prompt" del query para la busqueda

  const autoResize = (textarea) => {
    textarea.style.height = "auto"; // Restablecer altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar a la altura del contenido
  };

  /*-------------------------------------- C R U D --------------------------------------*/

  // Crear repuesto
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

  // Actualizar repuesto
  const updateRepuesto = async (id, field, value) => {
    const repuestoDoc = doc(db, "repuestos", id)
    await updateDoc(repuestoDoc, { [field]: value })

    setAllRepuestos((prevRepuestos) =>
      prevRepuestos.map((repuesto) =>
        repuesto.id === id ? { ...repuesto, [field]: value } : repuesto
      )
    )
  }

  // Eliminar repuesto
  const deleteRepuesto = async (id) => {
    const userDoc = doc(db, "repuestos", id)
    await deleteDoc(userDoc)

    setAllRepuestos((prevRepuestos) => prevRepuestos.filter((repuesto) => repuesto.id !== id))
  }

  /*-------------------------------------- CARGA DE DATOS --------------------------------------*/

  const loadAllRepuestos = async () => {
    const repuestosQuery = query(repuestosCollectionRef, orderBy("codigo", "asc"));
    const data = await getDocs(repuestosQuery);
    const repuestos = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setAllRepuestos(repuestos); // Guardar todos los registros
    setTotalPages(Math.ceil(repuestos.length / limit)); // Calcular el número total de páginas
    setDisplayedRepuestos(repuestos.slice(0, limit)); // Mostrar la primera página
  };

  // Obtener todos los registros al cargar el componente
  useEffect(() => {
    const fetchAllRepuestos = async () => {
      setIsLoading(true); // Inicia la carga
      try {
        loadAllRepuestos();
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchAllRepuestos();
  }, [limit]);

  /*-------------------------------------- MISCELÁNEA --------------------------------------*/

  // Funcion donde realiza el query para la busqueda
  const searchRepuestosInDatabase = async (term) => {
    if (term.trim() === "") {
      loadAllRepuestos(); // Si el término está vacío, cargar todos los repuestos
      return;
    }
    try {
      const filteredQuery = query(
        repuestosCollectionRef,
        orderBy("codigo"),
        startAt(term),
        endAt(term + "\uf8ff")
      );

      const filteredData = await getDocs(filteredQuery);
      setAllRepuestos(filteredData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error durante la búsqueda:", error);
    }
  };

  // Actualizar los registros mostrados cuando cambie la página o el límite
  useEffect(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedRepuestos(allRepuestos.slice(startIndex, endIndex)); // Mostrar los registros de la página actual
  }, [currentPage, limit, allRepuestos]);

  // Editar repuesto
  const makeEditable = (repuestoId, field, initialValue) => {
    return (
      <textarea
        rows={2}
        spellCheck="true"
        className="input"
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
        onInput={(e) => autoResize(e.target)}
        autoFocus
      />
    )
  }

  /*-------------------------------------- CODIGO HTML --------------------------------------*/

  return (
    <div className="min-h-screen">
      {/*------------------------------ HEADER ------------------------------*/}
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
          {/*------------------------------ GRILLA DE CREACION DE NUEVO REPUESTO ------------------------------*/}
          <div className="card-content">
            <button className="button" onClick={() => setShowNewRepuestoForm(!showNewRepuestoForm)}>
              {showNewRepuestoForm ? 'Cancelar' : 'Crear Nuevo Repuesto'}
            </button>
            {showNewRepuestoForm && (
              <div className='new-repuesto-form'>
                <h3>Crear nuevo repuesto</h3>
                <div className="form-grid">
                  <textarea spellCheck="true" className="input" rows={1} placeholder="Codigo..." onChange={(e) => setNewCodigo(e.target.value)} onInput={(e) => autoResize(e.target)} />
                  <textarea spellCheck="true" className="input" rows={1} placeholder="Descripcion..." onChange={(e) => setNewDescripcion(e.target.value)} onInput={(e) => autoResize(e.target)} />
                  <input spellCheck="true" className="input" type="number" placeholder="Cantidad disponible..." onChange={(e) => setNewCantDisp(e.target.value)} onInput={(e) => autoResize(e.target)} />
                  <textarea spellCheck="true" className="input" rows={1} placeholder="Numero estanteria..." onChange={(e) => setNewNumEstanteria(e.target.value)} onInput={(e) => autoResize(e.target)} />
                  <textarea spellCheck="true" className="input" rows={1} placeholder="Numero estante..." onChange={(e) => setNewNumeroEstante(e.target.value)} onInput={(e) => autoResize(e.target)} />
                  <textarea spellCheck="true" className="input" rows={1} placeholder="Numero BIN..." onChange={(e) => setNewNumeroBIN(e.target.value)} onInput={(e) => autoResize(e.target)} />
                  <textarea spellCheck="true" className="input" rows={1} placeholder="Posicion BIN..." onChange={(e) => setNewPosicionBIN(e.target.value)} onInput={(e) => autoResize(e.target)} />
                </div>
                <button className="button-newRepuesto" onClick={createRepuesto}>Crear Repuesto</button>
              </div>
            )}
          </div>
        </div>
        {/*------------------------------ TABLA DE REGISTROS ------------------------------*/}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Lista de Repuestos</h2>
            {/*------- Selector de límite -------*/}
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
            <input
              type="text"
              className="input search-input"
              placeholder="Buscar repuesto por código..."
              value={searchTerm}
              onChange={(e) => {
                const term = e.target.value;
                setSearchTerm(term);
                searchRepuestosInDatabase(term); // Llama a la función de búsqueda
              }}
            />
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
              {/*------- Paginación -------*/}
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={totalPages} // Número total de páginas
                  page={currentPage} // Página actual
                  onChange={(event, value) => setCurrentPage(value)} // Cambiar página
                  color="primary"
                  disabled={isLoading} // Deshabilitar mientras los datos cargan
                />
              </div>
              {/*------- Indicador de carga --------*/}
              {isLoading && <p>Cargando...</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

