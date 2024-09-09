const Joi = require('joi');

const quizSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(), // Le nom du quiz doit être entre 3 et 100 caractères
    summary: Joi.string().max(500), // Optionnel, jusqu'à 500 caractères
    questions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required(), // Les IDs des questions doivent être des ObjectId valides
    timing: Joi.number().min(1).max(180), // Le temps alloué en minutes, entre 1 et 180
    numberOfQuestions: Joi.number().min(1).required(), // Au moins une question requise
    instructor: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // L'ID de l'instructeur doit être un ObjectId valide
});

module.exports = {
    validateQuiz: (data) => quizSchema.validate(data)
};
