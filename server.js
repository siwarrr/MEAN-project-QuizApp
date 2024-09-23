const express = require('express');
const cors = require('cors'); 
const http = require('http');
require('./config/connect');


// Importation des routes
const userRoutes = require('./Routes/userRoutes');
const quizRoutes = require('./Routes/quizRoutes');

// Initialisation de l'application Express
const app = express();


// Utiliser cors avec des options pour autoriser l'origine spécifique
app.use(cors({
  origin: 'http://localhost:4200', // Autoriser uniquement cette origine
  methods: 'GET,POST,PUT,DELETE', // Spécifiez les méthodes HTTP autorisées
  allowedHeaders: 'Content-Type,Authorization' // Spécifiez les en-têtes autorisés
}));


// Parsing des requêtes JSON
app.use(express.json());


// Définir les routes de l'application
app.use('/user', userRoutes);
app.use('/quiz', quizRoutes);

//créer une instance de serveur HTTP
const server = http.createServer(app);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
