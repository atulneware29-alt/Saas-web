const ApiError = require('../utils/ApiError');

// Role check middleware factory
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role '${req.user.role}' is not authorized to access this route`
        )
      );
    }
    next();
  };
};

// Check if user owns resource or is admin
exports.checkOwnership = (resourceOwnerField = 'owner') => {
  return (req, res, next) => {
    const user = req.user;
    const resourceOwner = req.resource?.[resourceOwnerField];

    // Admin can access everything
    if (user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (resourceOwner && resourceOwner.toString() === user._id.toString()) {
      return next();
    }

    // For managers, check if they are team members
    if (user.role === 'manager' && req.resource?.members) {
      const isMember = req.resource.members.some(
        (member) => member.toString() === user._id.toString()
      );
      if (isMember) {
        return next();
      }
    }

    return next(new ApiError(403, 'Not authorized to access this resource'));
  };
};

// Middleware to attach resource to request for ownership check
exports.attachResource = (model, paramName = 'id', fieldName = 'id') => {
  return async (req, res, next) => {
    try {
      const Resource = require(`../models/${model}`);
      const resourceId = req.params[paramName];

      const resource = await Resource.findById(resourceId);

      if (!resource) {
        return next(new ApiError(404, `${model} not found`));
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
