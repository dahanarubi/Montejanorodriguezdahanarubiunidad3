const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apis'
});

conexion.connect((err) => {
    if (err) {
        console.log('Error de conexión:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/geo', (req, res) => {
    res.json({
        lat: 25.558259,
        lng: -100.936683,
        utc: new Date().toUTCString()
    });
});

app.get('/social', (req, res) => {
    res.json([
        { red: "Facebook", link: "https://www.facebook.com/utcoahuila" },
        { red: "Instagram ", link: "https://www.instagram.com/utcoahuila/" },
        { red: "Twitter", link: "https://twitter.com/utcoahuila" }
    ]);
});

app.get('/posts', (req, res) => {
    res.json([
        { titulo: "Nueva tecnología en México", autor: "El Universal", link: "https://www.eluniversal.com.mx" },
        { titulo: "Innovación en universidades", autor: "Milenio", link: "https://www.milenio.com" },
        { titulo: "Programación web 2026", autor: "Xataka", link: "https://www.xataka.com" }
    ]);
});

app.get('/buscar', async (req, res) => {
    try {
        let producto = req.query.producto || "phone";

        const traducciones = {
            telefono: "phone",
            celular: "phone",
            maquillaje: "makeup",
            zapatos: "shoes",
            reloj: "watch",
            laptop: "laptop",
            perfume: "perfume"
        };

        if (traducciones[producto.toLowerCase()]) {
            producto = traducciones[producto.toLowerCase()];
        }

        const response = await fetch(`https://dummyjson.com/products/search?q=${producto}`);
        const data = await response.json();

        const productos = data.products.map(p => ({
            nombre: p.title,
            precio: p.price,
            imagen: p.thumbnail,
            link: '#'
        }));

        res.json(productos);

    } catch (error) {
        console.log(error);
        res.json([]);
    }
});
// Endpoint para guardar usuario en la base de datos
app.post('/usuario', (req, res) => {
    const { nombre, usuario } = req.body;

    const sql = "INSERT INTO usuarios (nombre, usuario) VALUES (?, ?)";

    conexion.query(sql, [nombre, usuario], (err, result) => {
        if (err) {
            console.log(err);
            res.json({ mensaje: "Error al guardar" });
        } else {
            res.json({ mensaje: "Guardado en base de datos" });
        }
    });
});
// Endpoint para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    conexion.query("SELECT * FROM usuarios", (err, results) => {
        if (err) {
            res.json([]);
        } else {
            res.json(results);
        }
    });
});

app.post('/sms', (req, res) => {
    const { telefono, mensaje } = req.body;
    console.log(`Simulación SMS -> Tel: ${telefono}, Mensaje: ${mensaje}`);
    res.json({ mensaje: "SMS enviado correctamente (simulado)" });
});

// Endpoint para video (API externa)
app.get('/video', (req, res) => {
    res.json({
        video: "https://www.w3schools.com/html/mov_bbb.mp4"
    });
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
