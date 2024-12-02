import "./home.css";
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase-config";
import { query, orderBy } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { saveAs } from "file-saver";
import templateFile from "../Plantilla_excel.xlsx";
import ExcelJS from "exceljs";


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

  const autoResize = (textarea) => {
    textarea.style.height = "auto"; // Restablecer altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar a la altura del contenido
  };


  const exportToExcel = async (fichaData) => {
    // Cargar la plantilla usando fetch
    const templateBuffer = await fetch(templateFile).then((response) =>
      response.arrayBuffer()
    );

    // Leer la plantilla usando ExcelJS
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(templateBuffer);

    // Seleccionar la hoja de trabajo
    const worksheet = workbook.getWorksheet(1); // Cambia el índice si necesitas otra hoja

    // Modificar las celdas sin cambiar el formato
    worksheet.getCell("A3").value = fichaData.numero_ficha;
    worksheet.getCell("C7").value = fichaData.fecha_salida;
    worksheet.getCell("C11").value = fichaData.cliente;
    worksheet.getCell("C14").value = fichaData.fecha_ingreso;
    worksheet.getCell("E13").value = fichaData.serie;
    worksheet.getCell("A18").value = fichaData.diagnostico;
    worksheet.getCell("A29").value = fichaData.necesidades;

    // Exportar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${fichaData.numero_ficha}-${fichaData.cliente}-${fichaData.serie}.xlsx`);
  };

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
      const fichaQuery = query(fichaCollectionRef, orderBy("item", "asc"));
      try {
        // Intenta cargar desde la caché primero
        const data = await getDocs(fichaQuery, { source: "cache" });
        setFicha(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        console.log("Datos cargados desde la caché.");

      } catch (cacheError) {
        // Si la caché falla, intenta desde el servidor
        console.warn("No se pudo cargar desde la caché. Intentando desde el servidor...", cacheError);

        const serverData = await getDocs(fichaQuery, { source: "server" });
        setFicha(serverData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        console.log("Datos cargados desde el servidor.");
      }
    };

    getFicha();
  })

  const makeEditable = (fichaId, field, initialValue) => {
    return (
      <textarea
        spellCheck="true"
        rows={2}
        className="input-field"
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
        onInput={(e) => autoResize(e.target)}
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
            <h2 className="card-title">Gestión de fichas</h2>
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
                    spellCheck="true"
                    type="number"
                    className="input-field"
                    placeholder="Item..."
                    onChange={(event) => {
                      setNewItem(event.target.value);
                    }}
                  />
                  <input
                    spellCheck="true"
                    type="number"
                    className="input-field"
                    placeholder="#Ficha..."
                    onChange={(event) => {
                      setnewFichaN(event.target.value);
                    }}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Cliente..."
                    onChange={(event) => {
                      setnewCliente(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Serie..."
                    onChange={(event) => {
                      setnewSerie(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Fecha Ingreso..."
                    onChange={(event) => {
                      setnewIngreso(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Fecha salida..."
                    onChange={(event) => {
                      setnewSalida(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Modelo..."
                    onChange={(event) => {
                      setnewModelo(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Observacion..."
                    onChange={(event) => {
                      setnewObservacion(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Diagnostico..."
                    onChange={(event) => {
                      setnewDiagnostico(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Necesidades..."
                    onChange={(event) => {
                      setnewNecesidades(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Repuestos..."
                    onChange={(event) => {
                      setnewRepuestos(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Facturar..."
                    onChange={(event) => {
                      setnewFacturar(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Entregado..."
                    onChange={(event) => {
                      setnewEntregado(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Num Factura..."
                    onChange={(event) => {
                      setnewNumeroFactura(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Pago Ricardo..."
                    onChange={(event) => {
                      setnewPagoRicardo(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                </div>
                <button className="button-newFicha" onClick={createFicha}> Crear Ficha</button>
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
                          <button className="button button-excel" onClick={() => exportToExcel(ficha)}>Generar Excel</button>
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
