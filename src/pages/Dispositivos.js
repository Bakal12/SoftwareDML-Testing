import "./general.css"
import { Link } from "react-router-dom"

const Dispositivos = () => {

return (
    <div className="Dispositivos">
<body>
    <header>
        <nav>
            <ul>
                <li><a href="/Repuestos">Buscar Componentes Electrónicos</a></li>
                <li><a href="/Dispositivos">Revisar Dispositivos Electrónicos por Entregar</a></li>
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
};

export default Dispositivos;