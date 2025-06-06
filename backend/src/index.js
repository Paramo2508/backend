const express = require("express");
const cors = require("cors");
const { importUsers, importLevels, importShops, importAchievements, importUserAch, importItems, createSP } = require("../data/insert_data.js");

const { connectDB, sequelize_loggin, sequelize_game } = require("./config/db");

const { insertUsers } = require("../data/insert_users.js");
const { insertRequests } = require("../data/insert_requests.js");
const { insertFriends } = require("../data/insert_friends.js");

const { triggersSeasonPass } = require("../data/triggers/triggers-season-pass.js");

const authMiddleware = require("./middlewares/authMiddleware");

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

    await importItems();
    await importAchievements();
    await importLevels();
    await insertUsers(); // Ejecutar el script para insertar usuarios
    await insertRequests();
    await insertFriends(); // Descomentar para ver los amigos en vez de las solicitudes
    
    //Insertamos los datos en la base de datos
    await importUsers();
    await importShops();
    //await importUserAch();
    await createSP(); // Crear el pase de temporada
    await triggersSeasonPass(); // Crear los triggers para el pase de temporada
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

// Middleware de autenticación
app.use(authMiddleware);

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

const achievementRoutes = require("./routes/achievementsRoutes");
app.use("/achievements", achievementRoutes);

const itemRoutes = require("./routes/itemRoutes");
app.use("/items", itemRoutes);

const messagesRoutes = require("./routes/messagesRoutes");
app.use("/messages", messagesRoutes);


const privateGameRoutes = require("./routes/privateRoutes");
app.use("/private", privateGameRoutes);

// Rutas de la tienda
const shopRoutes = require("./routes/shopRoutes");
app.use("/shop", shopRoutes); // Asegúrate de que las rutas de la tienda estén registradas

// Rutas del pase de batalla
const seasonPassRoutes = require("./routes/seasonPassRoutes");
app.use("/season-pass", seasonPassRoutes);

// Rutas del contact support
const contactSupportRoutes = require("./routes/contactSupportRoutes");
app.use("/contact-support", contactSupportRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

