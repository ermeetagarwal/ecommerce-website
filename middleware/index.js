// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/user/login"); // Redirect to the login page if not authenticated
  }

export default ensureAuthenticated;