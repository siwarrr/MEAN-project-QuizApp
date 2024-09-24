const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /create
 * @description Crée un nouveau quiz avec les questions spécifiées.
 * @access Private (Instructor only)
 */
router.post('/create', authenticate, quizController.createQuiz);

/**
 * @route PUT /update/:quizId
 * @description Met à jour un quiz existant avec les nouvelles informations et questions.
 * @param {string} quizId - L'ID du quiz à mettre à jour.
 * @access Private (Instructor only)
 */
router.put('/update/:quizId', authenticate, quizController.updateQuiz);

/**
 * @route GET /available
 * @description Récupère les quizzes.
 * @access Private (Authenticated users)
 */
router.get('/available', authenticate, quizController.getAvailableQuizzes);

/**
 * @route GET /:quizId
 * @description Récupère un quiz spécifique par son ID.
 * @param {string} quizId - L'ID du quiz à récupérer.
 * @access Private (Authenticated users)
 */
router.get('/:quizId', authenticate, quizController.getQuizById);

/**
 * @route GET /:quizId/questions
 * @description Récupère toutes les questions d'un quiz spécifique.
 * @param {string} quizId - L'ID du quiz dont les questions doivent être récupérées.
 * @access Private (Authenticated users)
 */
router.get('/:quizId/questions', authenticate, quizController.getQuestionsByQuizId);

/**
 * @route GET /:quizId/questionCount
 * @description Récupère le nombre de questions dans un quiz spécifique.
 * @param {string} quizId - L'ID du quiz dont le nombre de questions doit être récupéré.
 * @access Private (Authenticated users)
 */
router.get('/:quizId/questionCount', authenticate, quizController.getNumberOfQuestionsInQuiz);

/**
 * @route POST /submit
 * @description Soumet un quiz et calcule le score de l'étudiant.
 * @body {string} quizId - L'ID du quiz soumis.
 * @body {string} studentId - L'ID de l'étudiant qui soumet le quiz.
 * @body {Array} answers - Les réponses soumises par l'étudiant.
 * @access Private (Students only)
 */
router.post('/submit', authenticate, quizController.submitQuiz);

/**
 * @route DELETE /delete/:quizId
 * @description Supprime un quiz spécifique et toutes les questions associées.
 * @param {string} quizId - L'ID du quiz à supprimer.
 * @access Private (Instructor only)
 */
router.delete('/delete/:quizId', authenticate, quizController.deleteQuiz);

/**
 * @route GET /instructor/quizzes
 * @description Récupère les quiz d'un instructeur.
 * @access Private (Authenticated users)
 */
router.get('/instructor/quizzes', authenticate, quizController.getInstructorQuizzes);

/**
 * @route GET /quiz/:quizId/results
 * @description Récupère les resultats.
 * @access Private (Authenticated users)
 */
router.get('/quiz/:quizId/results', authenticate, quizController.getQuizResults);



module.exports = router;