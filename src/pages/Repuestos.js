import './repuestos.css'
import OrdenASC from './Images/OrdenASC.png'
import OrdenDESC from './Images/OrdenDESC.png'
import OrdenIDLE from './Images/OrdenIDLE.png'
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
  const [repuestos, setRepuestos] = useState([
    {
      codigo: "",
      descripcion: "",
      cantidad_disponible: 0,
      numero_estanteria: "",
      numero_estante: "",
      numero_BIN: "",
      posicion_BIN: "",
    },
  ]); // Inicialmente contiene una sola grilla


  const [editingCell, setEditingCell] = useState(null) // Variable que referencia a editar las celdas

  const [showNewRepuestoForm, setShowNewRepuestoForm] = useState(false) // Variable que referencia a mostrar la grilla para crear nuevo repuesto

  const [allRepuestos, setAllRepuestos] = useState([]); // Variable que guarda todo el array de registros en la coleccion de la db
  const [displayedRepuestos, setDisplayedRepuestos] = useState([]); // Guarda registros actuales en pantalla
  const [limit, setLimit] = useState(5); // Guarda el límite por página
  const [currentPage, setCurrentPage] = useState(1); // Guarda la página actual
  const [totalPages, setTotalPages] = useState(1); // Guarda el total de páginas
  const [isLoading, setIsLoading] = useState(true); // Guarda el estado de carga
  const [sortField, setSortField] = useState(null); // Campo activo para ordenar
  const [sortDirection, setSortDirection] = useState("idle"); // Dirección actual (ascendente, descendente, idle)

  const [searchTerm, setSearchTerm] = useState("") // Guarda el "prompt" del query para la busqueda
  const [searchField, setSearchField] = useState("codigo"); // Campo por defecto para la búsqueda


  const autoResize = (textarea) => {
    textarea.style.height = "auto"; // Restablecer altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar a la altura del contenido
  };

  /*-------------------------------------- C R U D --------------------------------------*/

  /*--------------- Crear repuesto ---------------*/
  // Agregar una nueva grilla
  const addRepuesto = () => {
    setRepuestos((prev) => [
      ...prev,
      {
        codigo: "",
        descripcion: "",
        cantidad_disponible: 0,
        numero_estanteria: "",
        numero_estante: "",
        numero_BIN: "",
        posicion_BIN: "",
      },
    ]);
  };

  // Eliminar una grilla específica
  const removeRepuesto = (index) => {
    if (repuestos.length > 1) {
      setRepuestos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Actualizar los datos de una grilla
  const updateRepuestoField = (index, field, value) => {
    setRepuestos((prev) =>
      prev.map((repuesto, i) =>
        i === index ? { ...repuesto, [field]: value } : repuesto
      )
    );
  };

  // Crear todos los repuestos en Firebase
  const createAllRepuestos = async () => {
    try {
      const promises = repuestos.map((repuesto) =>
        addDoc(repuestosCollectionRef, {
          ...repuesto,
          cantidad_disponible: Number(repuesto.cantidad_disponible),
        })
      );
      await Promise.all(promises); // Espera a que se creen todos los repuestos
      loadAllRepuestos(); // Recarga la lista de repuestos
      setRepuestos([
        {
          codigo: "",
          descripcion: "",
          cantidad_disponible: 0,
          numero_estanteria: "",
          numero_estante: "",
          numero_BIN: "",
          posicion_BIN: "",
        },
      ]); // Reinicia las grillas a una sola grilla vacía
    } catch (error) {
      console.error("Error al crear los repuestos:", error);
    }
  };


  // Actualizar repuesto
  const updateRepuesto = async (id, field, value) => {
    const repuestoDoc = doc(db, "repuestos", id);

    // Si el campo es "cantidad_disponible", convierte el valor a número
    const updatedValue = field === "cantidad_disponible" ? Number(value) : value;

    try {
      await updateDoc(repuestoDoc, { [field]: updatedValue });

      setAllRepuestos((prevRepuestos) =>
        prevRepuestos.map((repuesto) =>
          repuesto.id === id ? { ...repuesto, [field]: updatedValue } : repuesto
        )
      );
    } catch (error) {
      console.error("Error al actualizar el repuesto:", error);
    }
  };


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
  const searchRepuestosInDatabase = async (term, field) => {
    if (term.trim() === "") {
      loadAllRepuestos(); // Si el término está vacío, cargar todos los repuestos
      return;
    }
    try {
      const filteredQuery = query(
        repuestosCollectionRef,
        orderBy(field),
        startAt(term),
        endAt(term + "\uf8ff")
      );

      const filteredData = await getDocs(filteredQuery);
      const filteredRepuestos = filteredData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setAllRepuestos(filteredRepuestos); // Actualizar la lista de repuestos filtrados
      setTotalPages(Math.ceil(filteredRepuestos.length / limit)); // Actualizar total de páginas
      setCurrentPage(1); // Reiniciar a la primera página
    } catch (error) {
      console.error("Error durante la búsqueda:", error);
    }
  };

  const toggleSort = (field) => {
    let nextDirection = "asc"; // Por defecto, comenzar en ascendente

    if (sortField === field) {
      // Alternar dirección si el campo actual ya está seleccionado
      nextDirection = sortDirection === "asc" ? "desc" : sortDirection === "desc" ? "idle" : "asc";
    }

    setSortField(nextDirection === "idle" ? null : field); // Limpiar campo si es idle
    setSortDirection(nextDirection);

    if (nextDirection !== "idle") {
      // Ordenar solo si no está en estado idle
      const sortedRepuestos = [...allRepuestos].sort((a, b) => {
        if (a[field] < b[field]) return nextDirection === "asc" ? -1 : 1;
        if (a[field] > b[field]) return nextDirection === "asc" ? 1 : -1;
        return 0;
      });
      setAllRepuestos(sortedRepuestos);
    }
  };

  const getRowClass = (cantidadDisponible) => {
    if (cantidadDisponible < 10) {
      return "low-stock"; // Menor que el stock mínimo
    } else if (cantidadDisponible <= 20) {
      return "near-stock"; // Cercano al stock mínimo
    }
    return ""; // Sin clase adicional
  };

  // Actualizar los registros mostrados cuando cambie la página o el límite
  useEffect(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedRepuestos(allRepuestos.slice(startIndex, endIndex));
  }, [currentPage, limit, allRepuestos]);

  // Editar repuesto
  const makeEditable = (repuestoId, field, initialValue) => {
    return (
      <textarea
        rows={2}
        spellCheck="true"
        className="input"
        style={{ width: "200px" }}
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
                Buscar componentes mecánicos
              </a>
            </li>
            <li>
              <a href="/pp/dml/home" className="nav-link">
                Revisar máquinas por Entregar
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
              <div className="new-repuesto-form">
                <h3>Crear nuevos repuestos</h3>
                {repuestos.map((repuesto, index) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    {/* Título dinámico */}
                    <h4>{`Repuesto ${index + 1}`}</h4>
                    <div className="form-grid">
                      <textarea
                        className="input"
                        rows={1}
                        placeholder="Codigo..."
                        value={repuesto.codigo}
                        onChange={(e) => updateRepuestoField(index, "codigo", e.target.value)}
                      />
                      <textarea
                        className="input"
                        rows={1}
                        placeholder="Descripcion..."
                        value={repuesto.descripcion}
                        onChange={(e) => updateRepuestoField(index, "descripcion", e.target.value)}
                      />
                      <input
                        className="input"
                        type="number"
                        placeholder="Cantidad disponible..."
                        value={repuesto.cantidad_disponible}
                        onChange={(e) => updateRepuestoField(index, "cantidad_disponible", e.target.value)}
                      />
                      <textarea
                        className="input"
                        rows={1}
                        placeholder="Numero estanteria..."
                        value={repuesto.numero_estanteria}
                        onChange={(e) => updateRepuestoField(index, "numero_estanteria", e.target.value)}
                      />
                      <textarea
                        className="input"
                        rows={1}
                        placeholder="Numero estante..."
                        value={repuesto.numero_estante}
                        onChange={(e) => updateRepuestoField(index, "numero_estante", e.target.value)}
                      />
                      <textarea
                        className="input"
                        rows={1}
                        placeholder="Numero BIN..."
                        value={repuesto.numero_BIN}
                        onChange={(e) => updateRepuestoField(index, "numero_BIN", e.target.value)}
                      />
                      <textarea
                        className="input"
                        rows={1}
                        placeholder="Posicion BIN..."
                        value={repuesto.posicion_BIN}
                        onChange={(e) => updateRepuestoField(index, "posicion_BIN", e.target.value)}
                      />
                      {/* Botón para eliminar la grilla */}
                      {index > 0 && (
                        <button
                          className="button button-destructive"
                          onClick={() => removeRepuesto(index)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {/* Botón para agregar una nueva grilla */}
                <button className="button-newRepuesto" onClick={addRepuesto}>
                  Agregar repuesto
                </button>
                {/* Botón para crear todos los repuestos */}
                <button className="button-newRepuesto" style={{marginLeft: "10px"}} onClick={createAllRepuestos}>
                  Crear repuestos
                </button>
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
            <div className="search-container">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                style={{
                  border: "1px solid #d1d5db",
                }}
              >
                {["codigo", "descripcion", "cantidad_disponible", "numero_estanteria", "numero_estante", "numero_BIN", "posicion_BIN"].map((field) => (
                  <option key={field} value={field}>
                    {field.replace("_", " ").charAt(0).toUpperCase() + field.replace("_", " ").slice(1)} {/* Capitaliza texto */}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="input search-input"
                placeholder={`Buscar por ${searchField.replace("_", " ")}`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchRepuestosInDatabase(e.target.value, searchField); // Realiza la búsqueda
                }}
              />
            </div>

          </div>
          <div className="card-content">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    {["codigo", "descripcion", "cantidad_disponible", "numero_estanteria", "numero_estante", "numero_BIN", "posicion_BIN"].map((field) => {
                      const icon =
                        sortField === field && sortDirection === "asc" ? OrdenASC :
                          sortField === field && sortDirection === "desc" ? OrdenDESC :
                            OrdenIDLE; // Usar idleIcon por defecto
                      return (
                        <th key={field}>
                          <div className='th-content'>
                            <span>{field.replace("_", " ")}</span> {/* Texto alineado a la izquierda */}
                            <img
                              src={icon} // Imagen dinámica según estado
                              alt={`Ordenar por ${field}`}
                              onClick={() => toggleSort(field)}
                            />
                          </div>
                        </th>
                      );
                    })}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRepuestos.map((repuesto) => (
                    <tr key={repuesto.id} className={getRowClass(repuesto.cantidad_disponible)}>
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

