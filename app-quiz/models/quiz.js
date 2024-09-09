const mongoose = require('mongoose');

/**
 * Quiz Schema
 * @description Schéma pour les quiz, incluant le nom, le résumé, les questions, le temps et le nombre de questions.
 */
const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Le nom du quiz est requis
    },
    summary: {
        type: String // Résumé du quiz
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question' // Référence au modèle Question
    }],
    timing: {
        type: Number // Temps alloué pour le quiz en minutes
    },
    numberOfQuestions: {
         type: Number  // Nombre de questions dans le quiz
    },
    instructor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Référence au modèle User
    }]
});

// Création du modèle Quiz à partir du schéma
const Quiz = mongoose .model('Quiz', quizSchema);

// Exportation du modèle Quiz
module.exports = Quiz;