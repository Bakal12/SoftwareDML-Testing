import React, { useState, useEffect } from 'react'
import { db } from "../firebase-config"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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

  const [repuestos, setRepuestos] = useState([])
  const repuestosCollectionRef = collection(db, 'repuestos')
  const [editingCell, setEditingCell] = useState(null)
  const [showNewRepuestoForm, setShowNewRepuestoForm] = useState(false)

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

    setRepuestos((prevRepuestos) => [
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

    setRepuestos((prevRepuestos) =>
      prevRepuestos.map((repuesto) =>
        repuesto.id === id ? { ...repuesto, [field]: value } : repuesto
      )
    )
  }

  const deleteRepuesto = async (id) => {
    const userDoc = doc(db, "repuestos", id)
    await deleteDoc(userDoc)

    setRepuestos((prevRepuestos) => prevRepuestos.filter((repuesto) => repuesto.id !== id))
  }

  useEffect(() => {
    const getRepuestos = async () => {
      const data = await getDocs(repuestosCollectionRef)
      setRepuestos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getRepuestos()
  }, [])

  const makeEditable = (repuestoId, field, initialValue) => {
    return (
      <input
        type="text"
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
              <a href="/Repuestos" className="nav-link">
                Buscar Componentes Electrónicos
              </a>
            </li>
            <li>
              <a href="/Home" className="nav-link">
                Revisar Dispositivos Electrónicos por Entregar
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Gestión de Repuestos</h2>
          </div>
          <div className="card-content">
            <button className="button" onClick={() => setShowNewRepuestoForm(!showNewRepuestoForm)}>
              {showNewRepuestoForm ? 'Cancelar' : 'Crear Nuevo Repuesto'}
            </button>
            {showNewRepuestoForm && (
              <div className="form-grid">
                <input className="input" placeholder="Codigo..." onChange={(e) => setNewCodigo(e.target.value)} />
                <input className="input" placeholder="Descripcion..." onChange={(e) => setNewDescripcion(e.target.value)} />
                <input className="input" type="number" placeholder="Cantidad disponible..." onChange={(e) => setNewCantDisp(e.target.value)} />
                <input className="input" placeholder="Numero estanteria..." onChange={(e) => setNewNumEstanteria(e.target.value)} />
                <input className="input" placeholder="Numero estante..." onChange={(e) => setNewNumeroEstante(e.target.value)} />
                <input className="input" placeholder="Numero BIN..." onChange={(e) => setNewNumeroBIN(e.target.value)} />
                <input className="input" placeholder="Posicion BIN..." onChange={(e) => setNewPosicionBIN(e.target.value)} />
                <button className="button" onClick={createRepuesto}>Crear Repuesto</button>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Lista de Repuestos</h2>
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
                  {repuestos.map((repuesto) => (
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Repuestos;
