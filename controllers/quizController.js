const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Result = require('../models/result');
const mongoose = require('mongoose');

/**
 * Crée un quiz .
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout le quiz créé.
 */
exports.createQuiz = async (req, res) => {
    try {
        const { name, summary, questions, timing, instructor } = req.body;

        if (!name || !summary || !questions || !timing || !instructor) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log('Received quiz data:', req.body);

        // Créer et enregistrer toutes les questions du quiz 
        const createdQuestions = await Promise.all(questions.map(async (questionData) => { 
            const { question, type, options, correctAnswer } = questionData; 
            
            // Créer une question et la sauvegarder dans la collection
            const createdQuestion = await Question.create({ 
                question, 
                type, 
                options, 
                correctAnswer 
            }); 
            
            // Retourner l'ID de la question créée
            return createdQuestion._id; 
        }));

        // Créer le quiz avec les IDs des questions créées et l'instructeur
        const quiz = await Quiz.create({
            name, 
            summary, 
            questions: createdQuestions, 
            timing, 
            instructor
        });

        console.log('Quiz created:', quiz);

        // Populate the quiz with question details
        const populatedQuiz = await Quiz.findById(quiz._id).populate('questions');

        // Envoyer la réponse avec le quiz créé et les détails des questions
        res.status(201).json(populatedQuiz);

    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Error creating quiz' });
    }
};  

/**
 * @async
 * @function updateQuiz
 * @description Met à jour un quiz.
 * @param {Object} req - La requête HTTP.
 * @param {Object} req.params - Les paramètres de la requête.
 * @param {string} req.params.quizId - L'ID du quiz.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.body.name - Le nom du quiz.
 * @param {string} req.body.summary - Le résumé du quiz.
 * @param {Array} req.body.questions - Les questions du quiz.
 * @param {number} req.body.timing - Le temps alloué pour le quiz.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { name, summary, questions, timing } = req.body;

        console.log('Updating quiz with ID:', quizId);
        console.log('Quiz data received:', { name, summary, questions, timing });

        // Mettre à jour ou créer toutes les questions du quiz
        const updatedQuestions = await Promise.all(questions.map(async (questionData) => {
            const { _id, question, type, options, correctAnswer } = questionData;
            console.log('Updating/Creating question:', questionData);

            // Validation des types de question
            if (type === 'multiple choice' && !Array.isArray(correctAnswer)) {
                throw new Error('Correct answer must be an array for multiple choice questions');
            } else if (type === 'short answer' && typeof correctAnswer !== 'string') {
                throw new Error('Correct answer must be a string for short answer questions');
            }

            let updatedQuestion;
            if (_id) {
                updatedQuestion = await Question.findByIdAndUpdate(
                    _id,
                    { question, type, options, correctAnswer },
                    { new: true }
                );
            } else {
                updatedQuestion = new Question({ question, type, options, correctAnswer });
                await updatedQuestion.save();
            }

            console.log('Updated/Created question:', updatedQuestion);
            return updatedQuestion._id;
        }));

        // Mettre à jour le quiz avec les nouvelles données et les IDs des questions mises à jour
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { name, summary, questions: updatedQuestions, timing },
            { new: true }
        ).populate('questions');

        console.log('Updated quiz:', updatedQuiz);

        res.status(200).json(updatedQuiz);
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Error updating quiz' });
    }
};

/**
 * @async
 * @function getQuizById
 * @description Récupère un quiz par son ID.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz by ID:', error);
        res.status(500).json({ message: 'Error fetching quiz by ID' });
    }
};

/**
 * Récupère la liste des questions d'un quiz.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout la liste des questions.
 */
exports.getQuestionsByQuizId = async (req, res) => {
    try {
        const { quizId } = req.params;
        
        // Récupérer le quiz correspondant à l'ID donné et peupler les questions
        const quiz = await Quiz.findById(quizId).populate('questions');
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        const questions = quiz.questions; 
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error retrieving questions by quiz ID:', error);
        res.status(500).json({ message: 'Error retrieving questions by quiz ID' });
    }
};
/**
 * Récupère le nombre de questions dans un quiz.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout le nombre de questions dans un quiz.
 */
exports.getNumberOfQuestionsInQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        // Récupérer le quiz correspondant à l'ID donné
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Compter le nombre de questions dans le quiz
        const numberOfQuestions = quiz.questions.length;

        res.status(200).json({ numberOfQuestions });
    } catch (error) {
        console.error('Error retrieving number of questions in quiz:', error);
        res.status(500).json({ message: 'Error retrieving number of questions in quiz' });
    }
};
/**
 * Soumet un quiz et calcule le score de l'étudiant.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout le score du quiz soumis.
 */
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, studentId, answers } = req.body;

        // Récupérez le quiz par son ID
        const quiz = await Quiz.findById(quizId).populate('questions');

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Vérifiez si le quiz a déjà été terminé par l'utilisateur
        const existingQuizScore = await Result.findOne({
            studentId: studentId,
            quizId: quizId,
            completed: true
        });

       /* if (existingQuizScore) {
            return res.status(400).json({ message: "Quiz already completed" });
        }*/

        // Calculez le score en comparant les réponses soumises avec les réponses correctes des questions
        let score = 0;
        const correctAnswers = quiz.questions.map((question, index) => {
            const correctAnswer = question.correctAnswer;
            const submittedAnswer = answers[index];

            let isCorrect = false;
            if (Array.isArray(correctAnswer)) {
                // Multiple choice question
                const correctAnswerLowerCase = correctAnswer.map(ans => ans.toLowerCase());
                const submittedAnswerLowerCase = Array.isArray(submittedAnswer) ? submittedAnswer.map(ans => ans.toLowerCase()) : [];
                isCorrect = correctAnswerLowerCase.length === submittedAnswerLowerCase.length &&
                            correctAnswerLowerCase.every(ans => submittedAnswerLowerCase.includes(ans));
            } else {
                // Single answer question
                isCorrect = submittedAnswer?.toLowerCase() === correctAnswer.toLowerCase();
            }

            if (isCorrect) {
                score++;
            }
            return { question: question.question, correctAnswer: correctAnswer };
        });

        // Calculez le score en pourcentage
        const totalQuestions = quiz.questions.length;
        const scorePercentage = (score / totalQuestions) * 100;

        // Déterminez la performance de l'étudiant en fonction du pourcentage de score
        let performance = "";
        if (scorePercentage >= 90) {
            performance = "Excellent!";
        } else if (scorePercentage >= 80) {
            performance = "Great";
        } else if (scorePercentage >= 70) {
            performance = "Good";
        } else if (scorePercentage >= 60) {
            performance = "Satisfactory";
        } else if (scorePercentage >= 50) {
            performance = "Fair";
        } else {
            performance = "Poor";
        }
        
        // Enregistrez le score dans le modèle Result
        const newQuizScore = new Result({
            studentId: studentId,
            quizId: quizId,
            score: score,
            performance: performance,
            completed: true // Marquer le quiz comme terminé ici
        });
        await newQuizScore.save();

        // Répondre avec les détails du score et les réponses correctes
        res.status(200).json({ 
            score: score, 
            totalQuestions: totalQuestions,
            scoreString: `${score}/${totalQuestions}`,
            percentage:  Math.round(scorePercentage) + "%",
            performance: performance,
            correctAnswers: correctAnswers
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @async
 * @function deleteQuiz
 * @description Supprime un quiz et toutes les questions associées.
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @returns {Promise<void>}
 */
exports.deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        await Question.deleteMany({ _id: { $in: quiz.questions } });




        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

        console.log('Deleted quiz:', deletedQuiz);

        res.status(200).json({
            acknowledged: true,
            insertedId: null,
            matchedCount: topicUpdateResult.matchedCount,
            modifiedCount: topicUpdateResult.modifiedCount,
            upsertedCount: 0
        });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Error deleting quiz' });
    }
};

/**
 * Obtenir les quiz d'un instructeur.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout la liste des quiz.
 */
exports.getInstructorQuizzes = async (req, res) => {
    try {
      const instructorId = req.user.userId;  // Assurez-vous que l'ID de l'utilisateur est récupéré correctement
  
      // Récupérer tous les quiz créés par cet instructeur
      const quizzes = await Quiz.find({ instructor: instructorId });
      
      res.status(200).json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Error fetching quizzes' });
    }
  };

  /**
 * Obtenir les résultats des étudiants pour un quiz donné.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @returns {Promise<void>} - Une promesse qui résout les résultats des étudiants.
 */
exports.getQuizResults = async (req, res) => {
    try {
        const { quizId } = req.params;  // Récupère l'ID du quiz depuis les paramètres de la requête

        // Vérifier si l'ID du quiz est fourni
        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }

        // Trouver tous les résultats pour ce quiz, en peuplant les informations des étudiants
        const results = await Result.find({ quizId })
            .populate('studentId', 'username email')  // Peupler les informations des étudiants
            .exec();

        // Vérifier s'il y a des résultats
        if (!results || results.length === 0) {
            return res.status(200).json([]);
        }

        // Envoyer les résultats
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ message: 'Error fetching quiz results' });
    }
};