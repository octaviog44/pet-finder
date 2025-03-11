const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const cors = require("cors");

// Configuración para permitir todas las solicitudes de origen
const corsOptions = {
  origin: "*", // Permite solicitudes desde cualquier origen
};

app.use(cors(corsOptions)); // Aplicar la configuración de CORS

app.use(express.json()); // Habilita el manejo de JSON en las solicitudes

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Configuración de PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mi_basededatos",
  password: "postgre",
  port: 8080,
});

// Verifica conexión a la BD
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.message);
  } else {
    console.log("✅ Conectado a PostgreSQL:", res.rows[0].now);
  }
});

// 🔹 Ruta para registrar usuario
app.post("/registrarse", async (req, res) => {
  console.log("Solicitud recibida en /registrarse");
  console.log("Datos recibidos:", req.body);

  const { email, contraseña, confirmarContraseña } = req.body;

  if (!email || !contraseña || !confirmarContraseña) {
    return res.status(400).json({ message: "❌ Faltan datos" });
  }

  if (contraseña !== confirmarContraseña) {
    return res.status(400).json({ message: "❌ Las contraseñas no coinciden" });
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  try {
    const result = await pool.query(
      "INSERT INTO usuarios (email, contraseña) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
    res.status(200).json({
      message: "✅ Usuario registrado con éxito",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.message);
    res
      .status(500)
      .json({ message: "❌ Error interno del servidor", error: error.message });
  }
});

// 🔹 Ruta para iniciar sesión
app.post("/iniciar-sesion", async (req, res) => {
  console.log("Solicitud recibida en /iniciar-sesion");
  console.log("Datos recibidos:", req.body);

  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ message: "❌ Faltan datos" });
  }

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "❌ Usuario no encontrado" });
    }

    const usuario = result.rows[0];
    const contraseñaValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

    if (!contraseñaValida) {
      return res.status(401).json({ message: "❌ Contraseña incorrecta" });
    }

    res.status(200).json({ message: "✅ Inicio de sesión exitoso", usuario });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    res
      .status(500)
      .json({ message: "❌ Error interno del servidor", error: error.message });
  }
});

// 🔹 Verificar que el servidor responde
app.get("/", (req, res) => {
  res.send("✅ Servidor activo");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${port}`);
});

/*const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de base de datos PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "petfinder",
  password: "yourpassword",
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Rutas básicas
// Registro de usuario
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Inicio de sesión
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ user: result.rows[0] });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Reportar mascota
app.post("/api/report", async (req, res) => {
  const { name, photo_url, location, user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO pets (name, photo_url, location, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, photo_url, location, user_id]
    );
    res.status(201).json({ pet: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Error al reportar mascota" });
  }
});

// Mascotas cercanas
app.get("/api/pets", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    // Aquí usaremos Algolia o Google Maps para buscar mascotas cercanas
    res.status(200).json({ pets: [] }); // Respuesta temporal
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mascotas cercanas" });
  }
});

// Actualizar reporte de mascota
app.put("/api/report/:id", async (req, res) => {
  const { id } = req.params;
  const { name, photo_url, location } = req.body;
  try {
    const result = await pool.query(
      "UPDATE pets SET name = $1, photo_url = $2, location = $3 WHERE id = $4 RETURNING *",
      [name, photo_url, location, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ pet: result.rows[0] });
    } else {
      res.status(404).json({ error: "Mascota no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar reporte de mascota" });
  }
});

// Eliminar reporte de mascota
app.delete("/api/report/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM pets WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ message: "Reporte eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Mascota no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar reporte de mascota" });
  }
});

// Obtener datos del usuario
app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      res.status(200).json({ user: result.rows[0] });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
});

// Integración de Google Maps
app.get("/api/map", async (req, res) => {
  const { address } = req.query;
  const axios = require("axios");
  const GOOGLE_MAPS_API_KEY = "your_google_maps_api_key"; // Reemplaza con tu clave real

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results.length > 0) {
      res
        .status(200)
        .json({ location: response.data.results[0].geometry.location });
    } else {
      res.status(404).json({ error: "Dirección no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos del mapa" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
*/
