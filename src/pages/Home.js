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
    <div className="Home">
      <body>
        <header>
          <nav>
            <ul>
              <li><a href="./Repuestos">Buscar Componentes Electrónicos</a></li>
              <li><a href="./Home">Revisar Dispositivos Electrónicos por Entregar</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <tablex>
            <input
              type="number"
              placeholder="Item..."
              onChange={(event) => {
                setNewItem(event.target.value);
              }}
            />
            <input
              type="number"
              placeholder="#Ficha..."
              onChange={(event) => {
                setnewFichaN(event.target.value);
              }}
            />
            <input
              placeholder="Cliente..."
              onChange={(event) => {
                setnewCliente(event.target.value);
              }}
            />
            <input
              placeholder="Serie..."
              onChange={(event) => {
                setnewSerie(event.target.value);
              }}
            />
            <input
              placeholder="Fecha Ingreso..."
              onChange={(event) => {
                setnewIngreso(event.target.value);
              }}
            />
            <input
              placeholder="Fecha salida..."
              onChange={(event) => {
                setnewSalida(event.target.value);
              }}
            />
            <input
              placeholder="Modelo..."
              onChange={(event) => {
                setnewModelo(event.target.value);
              }}
            />
            <input
              placeholder="Observacion..."
              onChange={(event) => {
                setnewObservacion(event.target.value);
              }}
            />
            <input
              placeholder="Diagnostico..."
              onChange={(event) => {
                setnewDiagnostico(event.target.value);
              }}
            />
            <input
              placeholder="Necesidades..."
              onChange={(event) => {
                setnewNecesidades(event.target.value);
              }}
            />
            <input
              placeholder="Repuestos..."
              onChange={(event) => {
                setnewRepuestos(event.target.value);
              }}
            />
            <input
              placeholder="Facturar..."
              onChange={(event) => {
                setnewFacturar(event.target.value);
              }}
            />
            <input
              placeholder="Entregado..."
              onChange={(event) => {
                setnewEntregado(event.target.value);
              }}
            />
            <input
              placeholder="Num Factura..."
              onChange={(event) => {
                setnewNumeroFactura(event.target.value);
              }}
            />
            <input
              placeholder="Pago Ricardo..."
              onChange={(event) => {
                setnewPagoRicardo(event.target.value);
              }}
            />
            <button onClick={createFicha}> Crear Ficha</button>
          </tablex>
          <h2>Dispositivos Electrónicos por Entregar</h2>
          <table>
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
          </table>
          {ficha.map((ficha) => {
            return (
              <div>
                <table>
                  <tbody>
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
                        <buttona onClick={() => { deleteFicha(ficha.id); }}>Eliminar</buttona>
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

export default Home;