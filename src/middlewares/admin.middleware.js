const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "error 403 : Admin only" });
  next();
};

module.exports = adminMiddleware;
