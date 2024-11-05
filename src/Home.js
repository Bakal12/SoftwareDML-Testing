import "./App.css";
import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";

/*
function Casa () {
    const [newItem, setNewItem] = useState("");
    const [newFichaN, setnewFichaN] = useState("");
    const [newCliente, setnewCliente] = useState(0)
    const [newSerie, setnewSerie] = useState("")
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

    const createFicha = async () => {
        await addDoc(fichaCollectionRef, { item: Number(newItem), numero_ficha: Number(newFichaN), cliente: newCliente, serie: newSerie, fecha_ingreso: newIngreso, fecha_salida: newSalida, modelo: newModelo, observacion: newObservacion, diagnostico: newDiagnostico, necesidades: newNecesidades, repuestos: newRepuestos, facturar: newFacturar, entregado: newEntregado, numero_factura: Number(newNumeroFactura), pago_ricardo:newPagoRicardo});
    };

    const deleteFicha = async (id) => {
        const userDoc = doc(db, "ficha", id);
        await deleteDoc(userDoc);
    };

    useEffect(() => {
        const getFicha = async () => {
          const data = await getDocs(fichaCollectionRef);
        //  console.log(doc.id);
          setFicha(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getFicha();
    }, []);
};
*/
const Home = () => {
    return (
        <div className="Home">
<body>
    <header>
        <nav>
            <ul>
                <li><a href="./index.html">Buscar Componentes Electrónicos</a></li>
                <li><a href="./dispositivos.html">Revisar Dispositivos Electrónicos por Entregar</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="revisarDispositivos">
            <h2>Dispositivos Electrónicos por Entregar</h2>
            <table>
                <thead>
                    <tr>
                        <th> hola</th>
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
                    </tr>
                </thead>
                <tbody id="deviceList">
                    <tr>
                        <td>10</td>
                        <td>1</td>
                        <td>12345</td>
                        <td>Juan Pérez</td>
                        <td>ABC1234</td>
                        <td>2024-10-10</td>
                        <td>2024-10-15</td>
                        <td>Modelo X</td>
                        <td>Reparar pantalla</td>
                        <td>Rotura de pantalla</td>
                        <td>Pantalla</td>
                        <td>No</td>
                        <td>No</td>
                        <td>No</td>
                        <td>---</td>
                        <td>No</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>
    <script src="../js/script.js"></script>
</body>
</div>
    );
}

export default Home;