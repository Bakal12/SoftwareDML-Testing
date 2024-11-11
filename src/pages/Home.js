import "./home.css";
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

const Home = () => {

  const [newItem, setNewItem] = useState(0);
  const [newFichaN, setnewFichaN] = useState(0);
  const [newCliente, setnewCliente] = useState("")
  const [newSerie, setnewSerie] = useState(0)
  const [newIngreso, setnewIngreso] = useState("")
  const [newSalida, setnewSalida] = useState("")
  const [newModelo, setnewModelo] = useState("")
  const [newObservacion, setnewObservacion] = useState("")
  const [newDiagnostico, setnewDiagnostico] = useState("")
  const [newNecesidades, setnewNecesidades] = useState("")
  const [newRepuestos, setnewRepuestos] = useState("")
  const [newFacturar, setnewFacturar] = useState("")
  const [newEntregado, setnewEntregado] = useState("")
  const [newNumeroFactura, setnewNumeroFactura] = useState("")
  const [newPagoRicardo, setnewPagoRicardo] = useState("")

  const [ficha, setFicha] = useState([]);
  const fichaCollectionRef = collection(db, 'ficha');
  const [editingCell, setEditingCell] = useState(null);
  const [showNewFichaForm, setShowNewFichaForm] = useState(false);



  const createFicha = async () => {
    await addDoc(fichaCollectionRef, {
      item: Number(newItem),
      numero_ficha: Number(newFichaN),
      cliente: newCliente,
      serie: newSerie,
      fecha_ingreso: newIngreso,
      fecha_salida: newSalida,
      modelo: newModelo,
      observacion: newObservacion,
      diagnostico: newDiagnostico,
      necesidades: newNecesidades,
      repuestos: newRepuestos,
      facturar: newFacturar,
      entregado: newEntregado,
      numero_factura: Number(newNumeroFactura),
      pago_ricardo: newPagoRicardo
    });

    setFicha((prevFicha) => [
      ...prevFicha,
      {
        id: fichaCollectionRef.id, item: Number(newItem),
        numero_ficha: Number(newFichaN),
        cliente: newCliente,
        serie: newSerie,
        fecha_ingreso: newIngreso,
        fecha_salida: newSalida,
        modelo: newModelo,
        observacion: newObservacion,
        diagnostico: newDiagnostico,
        necesidades: newNecesidades,
        repuestos: newRepuestos,
        facturar: newFacturar,
        entregado: newEntregado,
        numero_factura: Number(newNumeroFactura),
        pago_ricardo: newPagoRicardo
      },
    ]);
    setShowNewFichaForm(false);
  };

  const updateFicha = async (id, field, value) => {
    const fichaDoc = doc(db, "ficha", id);
    await updateDoc(fichaDoc, { [field]: value });
    setFicha((prevFicha) =>
      prevFicha.map((ficha) =>
        ficha.id === id ? { ...ficha, [field]: value } : ficha
      )
    );
  };

  const deleteFicha = async (id) => {
    const userDoc = doc(db, "ficha", id);
    await deleteDoc(userDoc);

    setFicha((prevFicha) => prevFicha.filter((ficha) => ficha.id !== id));

  };

  useEffect(() => {
    const getFicha = async () => {
      const data = await getDocs(fichaCollectionRef);
      console.log(data);
      setFicha(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getFicha();
  }, []);

  const makeEditable = (fichaId, field, initialValue) => {
    return (
      <input
        type="text"
        defaultValue={initialValue}
        onBlur={(e) => {
          updateFicha(fichaId, field, e.target.value);
          setEditingCell(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateFicha(fichaId, field, e.target.value);
            setEditingCell(null);
          }
        }}
        autoFocus
      />
    );
  };


  return (
    <div className="app-container">
      <header className="header">
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <a href="./Repuestos" className="nav-link">
                Buscar Componentes Electrónicos
              </a>
            </li>
            <li>
              <a href="./Home" className="nav-link">
                Revisar Dispositivos Electrónicos por Entregar
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Crear Nueva Ficha</h2>
          </div>
          <div className="card-content">
            <button className="button" onClick={() => setShowNewFichaForm(!showNewFichaForm)}>
              {showNewFichaForm ? 'Cancelar' : 'Crear Nueva Ficha'}
            </button>
            {showNewFichaForm && (
              <div className="new-ficha-form">
                <h3>Crear Nueva Ficha</h3>
                <div className="form-grid">
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Item..."
                    onChange={(event) => {
                      setNewItem(event.target.value);
                    }}
                  />
                  <input
                    type="number"
                    className="input-field"
                    placeholder="#Ficha..."
                    onChange={(event) => {
                      setnewFichaN(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Cliente..."
                    onChange={(event) => {
                      setnewCliente(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Serie..."
                    onChange={(event) => {
                      setnewSerie(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Fecha Ingreso..."
                    onChange={(event) => {
                      setnewIngreso(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Fecha salida..."
                    onChange={(event) => {
                      setnewSalida(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Modelo..."
                    onChange={(event) => {
                      setnewModelo(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Observacion..."
                    onChange={(event) => {
                      setnewObservacion(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Diagnostico..."
                    onChange={(event) => {
                      setnewDiagnostico(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Necesidades..."
                    onChange={(event) => {
                      setnewNecesidades(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Repuestos..."
                    onChange={(event) => {
                      setnewRepuestos(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Facturar..."
                    onChange={(event) => {
                      setnewFacturar(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Entregado..."
                    onChange={(event) => {
                      setnewEntregado(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Num Factura..."
                    onChange={(event) => {
                      setnewNumeroFactura(event.target.value);
                    }}
                  />
                  <input
                    className="input-field"
                    placeholder="Pago Ricardo..."
                    onChange={(event) => {
                      setnewPagoRicardo(event.target.value);
                    }}
                  />
                </div>
                <button className="button" onClick={createFicha}> Crear Ficha</button>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Dispositivos Electrónicos por Entregar</h2>
          </div>
          <div className="card-content table-card-content">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th># Ítem</th>
                    <th># Ficha</th>
                    <th>Cliente</th>
                    <th>Serie</th>
                    <th>Fecha Ingreso</th>
                    <th>Fecha Salida</th>
                    <th>Modelo</th>
                    <th>Observación</th>
                    <th>Diagnóstico</th>
                    <th>Necesidades</th>
                    <th>Repuestos</th>
                    <th>Facturar</th>
                    <th>Entregado</th>
                    <th>NºFactura</th>
                    <th>Pago Ricardo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ficha.map((ficha) => {
                    return (
                      <tr key={ficha.id}>
                        {["item", "numero_ficha", "cliente", "serie", "fecha_ingreso", "fecha_salida", "modelo", "observacion", "diagnostico", "necesidades", "repuestos", "facturar", "entregado", "numero_factura", "pago_ricardo"].map((field) => (
                          <td
                            key={field}
                            onDoubleClick={() => setEditingCell({ id: ficha.id, field })}
                          >
                            {editingCell?.id === ficha.id && editingCell.field === field
                              ? makeEditable(ficha.id, field, ficha[field])
                              : ficha[field]}
                          </td>
                        ))}
                        <td>
                          <button className="button button-destructive" onClick={() => { deleteFicha(ficha.id); }}>Eliminar</button>
                        </td>
                      </tr>
                    );
                  }
                  )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
