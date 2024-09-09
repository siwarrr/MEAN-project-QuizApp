const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

/**
 * @route POST /registerStudent
 * @description Inscrit un nouvel étudiant.
 * @access Public
 */
router.post('/registerStudent', userController.registerStudent);

/**
 * @route POST /registerTeacher
 * @description Inscrit un nouvel enseignant.
 * @access Public
 */
router.post('/registerInstructor', userController.registerInstructor);

/**
 * @route POST /login
 * @description Connecte un utilisateur.
 * @access Public
 */
router.post('/login', userController.loginUser);

module.exports = router;