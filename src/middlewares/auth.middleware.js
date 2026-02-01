const { verifyToken } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    // ✅ sempre garantir que req.user tem id e _id
    req.user = {
      id: decoded.id,
      _id: decoded.id,
      isAdmin: decoded.isAdmin || false,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports = authMiddleware;
