const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;

    if (req.user.isAdmin == "on") {
      return next();
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    // Handle the error or redirect the user to a different route
    // For example:
    return res.status(404);
  }
};

module.exports = verifyToken;
