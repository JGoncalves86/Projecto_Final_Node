const Flat = require('../models/Flat');
const Message = require('../models/message');

const ownerMiddleware = (resource) => {
  return async (req, res, next) => {
    try {
      let doc;

      // Escolher modelo baseado no recurso
      switch (resource) {
        case 'Flat':
          doc = await Flat.findById(req.params.id);
          break;
        case 'Message':
          doc = await Message.findById(req.params.id);
          break;
        default:
          return res.status(500).json({ message: 'Invalid resource type' });
      }

      if (!doc) {
        return res.status(404).json({ message: `${resource} not found` });
      }

      // Admin tem acesso
      if (req.user.isAdmin) return next();

      // Checar ownership
      const ownerField = resource === 'Flat' ? 'ownerId' : 'senderId';
      if (doc[ownerField].toString() !== req.user.id) {
        return res.status(403).json({
          message: `Access denied. Only owner or admin can perform this action.`,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = ownerMiddleware;
