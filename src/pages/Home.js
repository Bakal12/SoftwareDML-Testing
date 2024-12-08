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

  /*-------------------------------------- VARIABLES --------------------------------------*/

  const [newItem, setNewItem] = useState(0);
  const [newFichaN, setnewFichaN] = useState(0);
  const [newCliente, setnewCliente] = useState("")
  const [newSerie, setnewSerie] = useState(0)
  const [newModelo, setnewModelo] = useState("")
  const [newNumBat, setnewNumBat] = useState("")
  const [newNumCargador, setnewNumCargador] = useState("")
  const [newDiagnostico, setnewDiagnostico] = useState("")
  const [newTipo, setnewTipo] = useState("")
  const [newObservacion, setnewObservacion] = useState("")
  const [newReparacion, setnewReparacion] = useState("")
  const [newRepuestosColocados, setnewRepuestosColocados] = useState("")
  const [newRepuestosFaltantes, setnewRepuestosFaltantes] = useState("")
  const [newNumCiclos, setnewNumCliclos] = useState("")
  const [newEstado, setnewEstado] = useState("")

  const [ficha, setFicha] = useState([]); // Guarda todo el array de registros de la collection
  const fichaCollectionRef = collection(db, 'ficha'); // Variable que referencia a la collection de la db
  const [repuestosInfo, setRepuestosInfo] = useState({});
  const [editingCell, setEditingCell] = useState(null); // Variable que referencia a editar celdas
  const [showNewFichaForm, setShowNewFichaForm] = useState(false); // Variable que referencia a mostrar la grilla para crear nueva ficha

  /*-------------------------------------- C R U D --------------------------------------*/

  // Crear nuevo registro de ficha
  const createFicha = async () => {
    await addDoc(fichaCollectionRef, {
      item: Number(newItem),
      numero_ficha: Number(newFichaN),
      cliente: newCliente,
      serie: newSerie,
      modelo: newModelo,
      nº_bat: newNumBat,
      nº_cargador: newNumCargador,
      diagnostico: newDiagnostico,
      tipo: newTipo,
      observaciones: newObservacion,
      reparacion: newReparacion,
      repuestos_colocados: newRepuestosColocados,
      repuestos_faltantes: newRepuestosFaltantes,
      nº_ciclos: newNumCiclos,
      estado: newEstado,
    });

    setFicha((prevFicha) => [
      ...prevFicha,
      {
        id: fichaCollectionRef.id,
        item: Number(newItem),
        numero_ficha: Number(newFichaN),
        cliente: newCliente,
        serie: newSerie,
        modelo: newModelo,
        nº_bat: newNumBat,
        nº_cargador: newNumCargador,
        diagnostico: newDiagnostico,
        tipo: newTipo,
        observaciones: newObservacion,
        reparacion: newReparacion,
        repuestos_colocados: newRepuestosColocados,
        repuestos_faltantes: newRepuestosFaltantes,
        nº_ciclos: newNumCiclos,
        estado: newEstado,
      },
    ]);
    setShowNewFichaForm(false);
  };

  // Actualizar registro de ficha modificado
  const updateFicha = async (id, field, value) => {
    const fichaDoc = doc(db, "ficha", id);
    await updateDoc(fichaDoc, { [field]: value });
    setFicha((prevFicha) =>
      prevFicha.map((ficha) =>
        ficha.id === id ? { ...ficha, [field]: value } : ficha
      )
    );
  };

  // Eliminar registro de ficha
  const deleteFicha = async (id) => {
    const userDoc = doc(db, "ficha", id);
    await deleteDoc(userDoc);

    setFicha((prevFicha) => prevFicha.filter((ficha) => ficha.id !== id));

  };



  // Recopila todos los registros de la coleccion de la db
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

  /*-------------------------------------- MISCELÁNEA --------------------------------------*/

  useEffect(() => {
    const fetchRepuestosInfo = async () => {
      const repuestosCollectionRef = collection(db, "repuestos");
      const data = await getDocs(repuestosCollectionRef);
  
      const repuestosData = data.docs.reduce((acc, doc) => {
        const repuesto = doc.data();
        acc[repuesto.codigo] = repuesto; // Usa el código como clave
        return acc;
      }, {});
  
      setRepuestosInfo(repuestosData); // Actualiza el estado con los datos
    };
  
    fetchRepuestosInfo();
  }, []); // Ejecuta solo al montar el componente

  const renderRepuestosFaltantes = (repuestosMap) => {
    const repuestosData = Object.entries(repuestosMap).map(([codigo, cantidades]) => {
      const info = repuestosInfo[codigo];
      let warningIcon = null;
  
      if (info) {
        const cantidadRestante = info.cantidad_disponible - cantidades[0];
        const stockMinimo = 10; // Define el stock mínimo aquí o toma un valor dinámico
  
        if (cantidadRestante < 0) {
          warningIcon = (
            <span
              className="warning-icon"
              title="No hay suficientes repuestos disponibles"
              style={{ color: "red" }}
            >
              ⚠️
            </span>
          );
        } else if (cantidadRestante < stockMinimo) {
          warningIcon = (
            <span
              className="warning-icon"
              title="El stock está por debajo del mínimo"
              style={{ color: "orange" }}
            >
              ⚠️
            </span>
          );
        }
      }
  
      return (
        <div key={codigo} className="repuesto-row">
          {codigo} ({cantidades[0]})
          {warningIcon}
        </div>
      );
    });
  
    return <div className="repuestos-list">{repuestosData}</div>;
  };

  // Funcion para crear archivo Excel importando ciertos datos de la tabla
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
    worksheet.getCell("C11").value = fichaData.cliente;
    worksheet.getCell("E13").value = fichaData.serie;
    worksheet.getCell("E14").value = fichaData.nº_bat;
    worksheet.getCell("E15").value = fichaData.nº_cargador;
    worksheet.getCell("A18").value = fichaData.diagnostico;
    worksheet.getCell("A29").value = fichaData.reparacion;

    // Exportar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${fichaData.numero_ficha}-${fichaData.cliente}-${fichaData.serie}.xlsx`);
  };

  // Autoredimensionado de las celdas una vez llegado a su límite de espacio
  const autoResize = (textarea) => {
    textarea.style.height = "auto"; // Restablecer altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar a la altura del contenido
  };

  // Editar las celdas
  const makeEditable = (fichaId, field, initialValue) => {
    const isRepuestosField = field === "repuestos_colocados" || field === "repuestos_faltantes";

    // Renderizar campos según el tipo
    if (isRepuestosField) {
      const repuestosMap = initialValue || {};

      return (
        <div className="editable-repuestos">
          {Object.entries(repuestosMap).map(([nombre, cantidades], index) => (
            <div key={index} className="repuesto-row">
              <input
                type="text"
                defaultValue={nombre}
                className="input-field"
                placeholder="Nombre del repuesto"
                onBlur={(e) => {
                  const newNombre = e.target.value;
                  const newRepuestos = { ...repuestosMap };
                  if (newNombre !== nombre) {
                    newRepuestos[newNombre] = newRepuestos[nombre];
                    delete newRepuestos[nombre];
                  }
                  updateFicha(fichaId, field, newRepuestos);
                }}
              />
              <input
                type="number"
                defaultValue={cantidades[0]}
                className="input-field"
                placeholder="Cantidad"
                onBlur={(e) => {
                  const newCantidad = Number(e.target.value);
                  const newRepuestos = { ...repuestosMap };
                  newRepuestos[nombre] = [newCantidad];
                  updateFicha(fichaId, field, newRepuestos);
                }}
              />
              <button
                className="button button-delete"
                onClick={() => {
                  const newRepuestos = { ...repuestosMap };
                  delete newRepuestos[nombre];
                  updateFicha(fichaId, field, newRepuestos);
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
          <div className="add-repuesto">
            <input
              type="text"
              className="input-field"
              placeholder="Nuevo repuesto"
              id={`new-repuesto-${field}`}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Cantidad"
              id={`new-cantidad-${field}`}
            />
            <button
              className="button button-add"
              onClick={() => {
                const nombre = document.getElementById(`new-repuesto-${field}`).value;
                const cantidad = Number(document.getElementById(`new-cantidad-${field}`).value);

                if (nombre && cantidad > 0) {
                  const newRepuestos = { ...repuestosMap };
                  newRepuestos[nombre] = [cantidad];
                  updateFicha(fichaId, field, newRepuestos);

                  // Limpiar los campos de entrada
                  document.getElementById(`new-repuesto-${field}`).value = "";
                  document.getElementById(`new-cantidad-${field}`).value = "";
                }
              }}
            >
              Agregar
            </button>
          </div>
        </div>
      );
    }

    // Opciones predefinidas para "Tipo", "Modelo" y "Estado"
    const predefinedOptions = {
      tipo: ["Manual", "A batería", "Neumática"],
      modelo: ["ITA 10", "ITA 11", "ITA 12", "ITA 20", "ITA 21", "ITA 24", "ITA 25", "CT 20", "CT 25", "CT 40", "CTT 20", "CTT 25", "CTT 40"],
      estado: ["En revisión", "A la espera de repuestos", "Lista para entregar", "Entregada"],
    };

    if (predefinedOptions[field]) {
      return (
        <select
          className="input-field"
          style={{width: "100px"}}
          defaultValue={initialValue}
          onChange={(e) => {
            updateFicha(fichaId, field, e.target.value);
            setEditingCell(null);
          }}
        >
          {predefinedOptions[field].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    // Para otros campos
    return (
      <textarea
        spellCheck="true"
        rows={2}
        className="input-field"
        style={{width: "200px"}}
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

  const parseRepuestos = (input) => {
    const lines = input.split("\n").filter((line) => line.trim() !== "");
    const repuestosMap = {};

    lines.forEach((line) => {
      const match = line.match(/^(.+)\s\((\d+)\)$/);
      if (match) {
        const [_, nombre, cantidad] = match;
        if (!repuestosMap[nombre]) {
          repuestosMap[nombre] = [];
        }
        repuestosMap[nombre].push(Number(cantidad));
      }
    });

    return repuestosMap;
  };

  const formatRepuestosForDisplay = (repuestosMap) => {
    return Object.entries(repuestosMap).map(
      ([nombre, cantidades]) => `${nombre} (${cantidades.join(", ")})`
    );
  };

  /*-------------------------------------- HTML --------------------------------------*/
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
                    type="number"
                    className="input-field"
                    value={newItem}
                    disabled
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
                  <select
                    className="input-field"
                    placeholder="Modelo..."
                    onChange={(event) => {
                      setnewModelo(event.target.value);
                    }}
                    value={newModelo}
                  >
                    <option value="" disabled>Modelo...</option>
                    <option value="ITA 10">ITA 10</option>
                    <option value="ITA 11">ITA 11</option>
                    <option value="ITA 12">ITA 12</option>
                    <option value="ITA 20">ITA 20</option>
                    <option value="ITA 21">ITA 21</option>
                    <option value="ITA 24">ITA 24</option>
                    <option value="ITA 25">ITA 25</option>
                    <option value="CT 20">CT 20</option>
                    <option value="CT 25">CT 25</option>
                    <option value="CT 40">CT 40</option>
                    <option value="CTT 20">CTT 20</option>
                    <option value="CTT 25">CTT 25</option>
                    <option value="CTT 40">CTT 40</option>
                  </select>
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Nº Bat..."
                    onChange={(event) => {
                      setnewNumBat(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Nº Cargador..."
                    onChange={(event) => {
                      setnewNumCargador(event.target.value);
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
                  <select
                    className="input-field"
                    placeholder="Tipo..."
                    onChange={(event) => {
                      setnewTipo(event.target.value);
                    }}
                    value={newTipo}
                  >
                    <option value="" disabled>Tipo...</option>
                    <option value="Manual">Manual</option>
                    <option value="A batería">A batería</option>
                    <option value="Neumática">Neumática</option>
                  </select>
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Observaciones..."
                    onChange={(event) => {
                      setnewObservacion(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Reparacion..."
                    onChange={(event) => {
                      setnewReparacion(event.target.value);
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <div className="textarea-with-tooltip">
                    <textarea
                      spellCheck="true"
                      rows={1}
                      className="input-field"
                      placeholder="Repuesto_colocado (Cantidad)..."
                      onChange={(event) => {
                        setnewRepuestosColocados(parseRepuestos(event.target.value));
                      }}
                      onInput={(e) => autoResize(e.target)}
                    ></textarea>
                    <div className="info-icon-container">
                      <span className="info-icon">ℹ️</span>
                      <div className="tooltip">
                        Respeta la nomenclatura: "nombre_del_repuesto (cantidad)", separando cada
                        repuesto por una nueva línea (Enter del teclado).
                      </div>
                    </div>
                  </div>

                  <div className="textarea-with-tooltip">
                    <textarea
                      spellCheck="true"
                      rows={1}
                      className="input-field"
                      placeholder="Repuesto_faltante (Cantidad)..."
                      onChange={(event) => {
                        setnewRepuestosFaltantes(parseRepuestos(event.target.value));
                      }}
                      onInput={(e) => autoResize(e.target)}
                    ></textarea>
                    <div className="info-icon-container">
                      <span className="info-icon">ℹ️</span>
                      <div className="tooltip">
                        Respeta la nomenclatura: "nombre_del_repuesto (cantidad)", separando cada
                        repuesto por una nueva línea (Enter del teclado).
                      </div>
                    </div>
                  </div>
                  <textarea
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Nº Ciclos..."
                    onChange={(event) => {
                      setnewNumCliclos(parseRepuestos(event.target.value));
                    }}
                    onInput={(e) => autoResize(e.target)}
                  />
                  <select
                    spellCheck="true"
                    rows={1}
                    className="input-field"
                    placeholder="Estado..."
                    onChange={(event) => {
                      setnewEstado(event.target.value);
                    }}
                    value={newEstado}
                  >
                    <option value="" disabled>Estado...</option>
                    <option value="En revisión">En revisión</option>
                    <option value="A la espera de repuestos">A la espera de repuestos</option>
                    <option value="Lista para entregar">Lista para entregar</option>
                    <option value="Entregada">Entregada</option>
                  </select>
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
                    <th>Nº Serie</th>
                    <th>Modelo</th>
                    <th>Nº Bat</th>
                    <th>Nº Cargador</th>
                    <th>Diagnóstico ingreso</th>
                    <th>Tipo</th>
                    <th>Observaciones</th>
                    <th>Reparación</th>
                    <th>Nº Ciclos</th>
                    <th>Repuestos Colocados</th>
                    <th>Repuestos Faltantes</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ficha.map((ficha) => {
                    return (
                      <tr key={ficha.id}>
                        <td key="item">
                          {ficha.item}
                        </td>
                        {["numero_ficha", "cliente", "serie", "modelo", "nº_bat", "nº_cargador", "diagnostico", "tipo", "observaciones", "reparacion", "nº_ciclos"].map((field) => (
                          <td
                            key={field}
                            onDoubleClick={() => setEditingCell({ id: ficha.id, field })}
                          >
                            {editingCell?.id === ficha.id && editingCell.field === field
                              ? makeEditable(ficha.id, field, ficha[field])
                              : ficha[field]}
                          </td>
                        ))}
                        <td
                          key="repuestos_colocados"
                          onDoubleClick={() => setEditingCell({ id: ficha.id, field: "repuestos_colocados" })}
                        >
                          {editingCell?.id === ficha.id && editingCell.field === "repuestos_colocados"
                            ? makeEditable(ficha.id, "repuestos_colocados", ficha.repuestos_colocados)
                            : (
                              <div className="repuestos-list">
                                {formatRepuestosForDisplay(ficha.repuestos_colocados).map((repuesto, index) => (
                                  <div key={index}>{repuesto}</div>
                                ))}
                              </div>
                            )}
                        </td>
                        <td
                          key="repuestos_faltantes"
                          onDoubleClick={() => setEditingCell({ id: ficha.id, field: "repuestos_faltantes" })}
                        >
                          {editingCell?.id === ficha.id && editingCell.field === "repuestos_faltantes"
                            ? makeEditable(ficha.id, "repuestos_faltantes", ficha.repuestos_faltantes)
                            : renderRepuestosFaltantes(ficha.repuestos_faltantes)}
                        </td>

                        <td
                          key="estado"
                          style={{
                            backgroundColor:
                              ficha.estado === "En revisión" ? "yellow" :
                                ficha.estado === "A la espera de repuestos" ? "orange" :
                                  ficha.estado === "Lista para entregar" ? "darkgreen" :
                                    ficha.estado === "Entregada" ? "lightgreen" : "transparent",
                            color: ficha.estado === "Lista para entregar" ? "white" : "black",
                          }}
                          onDoubleClick={() => setEditingCell({ id: ficha.id, field: "estado" })}
                        >
                          {editingCell?.id === ficha.id && editingCell.field === "estado"
                            ? makeEditable(ficha.id, "estado", ficha.estado)
                            : ficha.estado}
                        </td>
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
