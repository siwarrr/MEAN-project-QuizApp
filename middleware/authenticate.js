const jwt = require('jsonwebtoken');

/**
 * Middleware pour authentifier les utilisateurs en vérifiant le jeton JWT.
 *
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 * @param {Function} next - La fonction suivante à appeler pour passer au middleware suivant.
 * @returns {Object} Réponse HTTP avec un code de statut approprié si le jeton est manquant, invalide ou expiré.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      }
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    req.user = decoded;  // Assignez tout l'objet utilisateur décodé à req.user
    next();
  });
};

module.exports = authenticate;
