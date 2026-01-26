// ownerMiddleware(req.user.id, resourceOwnerId)
const ownerMiddleware = (resourceOwnerId) => {
  return (req, res, next) => {
    if (req.user.isAdmin || req.user.id === resourceOwnerId.toString()) {
      next();
    } else {
      res.status(403).json({ message: "error 403 : Access denied" });
    }
  };
};

module.exports = ownerMiddleware;
