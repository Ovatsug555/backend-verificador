const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000; // El puerto donde escuchará el servidor

// Middlewares (Configuraciones necesarias)
app.use(cors()); // Permite que tu frontend se comunique con este backend
app.use(express.json()); // Permite recibir datos en formato JSON

// Función auxiliar para leer la base de datos
const leerBaseDeDatos = () => {
    try {
        const data = fs.readFileSync('./database.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo base de datos", error);
        return {};
    }
};

// Función auxiliar para guardar en la base de datos
const guardarEnBaseDeDatos = (data) => {
    try {
        fs.writeFileSync('./database.json', JSON.stringify(data, null, 4));
        return true;
    } catch (error) {
        console.error("Error guardando base de datos", error);
        return false;
    }
};

// --- RUTA 1: CONSULTAR (Para el buscador) ---
app.get('/api/consultar/:dni', (req, res) => {
    const database = leerBaseDeDatos();
    const dni = req.params.dni;
    const cliente = database[dni];

    if (cliente) {
        res.json(cliente);
    } else {
        res.status(404).json({ estado: "No encontrado" });
    }
});

// --- RUTA 2: AGREGAR (Para el panel de admin) ---
app.post('/api/agregar', (req, res) => {
    const database = leerBaseDeDatos();
    const nuevoCliente = req.body;
    const dni = nuevoCliente.dni;

    // Guardamos/Actualizamos el cliente
    database[dni] = {
        nombre: nuevoCliente.nombre,
        estado: nuevoCliente.estado,
        debeA: parseInt(nuevoCliente.debeA) || 0
    };

    if (guardarEnBaseDeDatos(database)) {
        console.log(`Cliente ${dni} guardado exitosamente.`);
        res.status(201).json({ mensaje: "Cliente guardado exitosamente." });
    } else {
        res.status(500).json({ mensaje: "Error interno al guardar los datos." });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Backend corriendo en http://localhost:${PORT}`);
});