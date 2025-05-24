import passport from "../middlewares/passport.mid.js";

// const passportCb = (strategy) => {
//   return async (req, res, next) => {
//     passport.authenticate(strategy, (err, user, info) => {
//       if (err) return next(err);

//       if (!user) {
//         const error = new Error(info?.message || "Bad auth from callback");
//         error.statusCode = info?.statusCode || 401;
//         return next(error);
//       }

//       req.user = user;
//       next();
//     })(req, res, next);
//   };
// };
const passportCb = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        const error = new Error(info?.message || "Bad auth from callback");
        error.statusCode = info?.statusCode || 401;
        return next(error);
      }

      req.user = user;
      // *** CAMBIO APLICADO AQUÍ ***
      if (info && info.token) {
        req.token = info.token; // Adjunta el token al objeto de la petición
      }
      next(); // Continúa al siguiente middleware/controlador (que es 'login')
    })(req, res, next);
  };
};
export default passportCb;
