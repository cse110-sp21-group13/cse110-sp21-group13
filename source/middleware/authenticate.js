module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(new Error('User not authenticated.'));
  }
};
