const express = require("express");
const cors = require("cors");
const { importUsers, importLevels } = require("../data/insert_data.js");

const { connectDB, sequelize_loggin, sequelize_game } = require("./config/db");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Sincroniza la base de datos.
 */
const sync_database = async () => {
  try {
    await sequelize_loggin.sync({ force: true });
    console.log("[ + ] Base de datos de loggin sincronizada correctamente");
    
    await sequelize_game.sync({ force: true });
    console.log("[ + ] Base de datos del juego sincronizada correctamente");

    await importLevels();
    await importUsers();
  } catch (error) {
    console.error("[ - ] Error sincronizando la base de datos de loggin:", error);
    process.exit(1);
  }
  
};

connectDB().then(sync_database);

// Middleware para leer JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando! 🚀");
});

// Rutas de autenticación
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Rutas de usuario
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payment", paymentRoutes);

// Rutas de la pantalla principal
const mainScreenRoutes = require("./routes/mainScreenRoutes");
app.use("/main-screen", mainScreenRoutes);

// Rutas de amigos
const friendRoutes = require("./routes/friendRoutes");
app.use("/friends", friendRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

