const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 * @description Schema de l'utilisateur contenant les informations de base 
 */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true// Le nom complet est requis
    },
    email: {
        type: String,
        required: true,
        unique: true, // L'e-mail doit être unique
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true// Le mot de passe est requis
    },
    role: {
        type: String,
        enum: ['instructor', 'student'], // Les rôles autorisés
        required: true // L'utilisateur doit choisir un rôle
    }

}, { timestamps: true } );


const User = mongoose.model('User', UserSchema);

module.exports = User;