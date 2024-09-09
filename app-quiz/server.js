const express = require('express');
const http = require('http');
require('./config/connect');


// Importation des routes
const userRoutes = require('./Routes/userRoutes');

// Initialisation de l'application Express
const app = express();

// Parsing des requêtes JSON
app.use(express.json());


// Définir les routes de l'application
app.use('/user', userRoutes);

//créer une instance de serveur HTTP
const server = http.createServer(app);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
