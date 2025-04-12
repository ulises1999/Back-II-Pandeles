import passport from "../middlewares/passport.mid.js";

const passportCb = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error(info.message || "Bad auth from cb");
        error.statusCode = info.statusCode || 401;
        return next(error);
      }
      req.user = user;
      req.token= user.token;
      next();
    })(req, res, next);
  };
};

export default passportCb;