const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Result Schema
 * @description Schéma pour les scores des quiz, incluant l'étudiant, le quiz, le score, la performance et l'état de complétion.
 */
const ResultSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence au modéle User 
        required: true
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz', // Référence au modéle Quiz
        required: true
    },
    score: {
        type: Number, 
        required: true
    },
    performance: {
        type: String, 
        required: true
    },
    completed: {
        type: Boolean, // Indique si le quiz est terminé
        default: false 
    }
});

// Création du modèle Result à partir du schéma
const Result = mongoose.model('Result', ResultSchema);

// Exportation du modèle QuizScore
module.exports = Result;
